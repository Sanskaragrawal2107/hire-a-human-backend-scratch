from uuid import UUID
import json
import os

from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from src.auth import get_current_recruiter
from src.repositories.thread_repo import (
    create_thread,
    delete_thread,
    get_thread_by_id,
    get_threads_by_recruiter,
    update_thread_title,
)
from src.services.agent_service import stream_agent_response
from src.database import get_db

router = APIRouter(prefix="/agent", tags=["Agent"])


# ── Request / Response models ─────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


class NewThreadRequest(BaseModel):
    first_message: str | None = None  # used to auto-generate title


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/threads")
async def create_new_thread(
    body: NewThreadRequest | None = None,
    recruiter=Security(get_current_recruiter),
):
    """Create a new chat thread. Title is auto-generated from first message."""
    recruiter_id = UUID(recruiter["id"])

    # Use the first message as a title when present; otherwise fall back to a default.
    first_message = body.first_message.strip() if body and body.first_message else ""
    if first_message:
        title = first_message[:60]
        if len(first_message) > 60:
            title += "..."
    else:
        title = "New thread"

    thread = await create_thread(recruiter_id=recruiter_id, title=title)
    return thread


@router.get("/threads")
async def list_threads(recruiter=Security(get_current_recruiter)):
    """List all chat threads for the current recruiter."""
    recruiter_id = UUID(recruiter["id"])
    threads = await get_threads_by_recruiter(recruiter_id)
    return threads


@router.delete("/threads/{thread_id}")
async def delete_thread_route(
    thread_id: UUID,
    recruiter=Security(get_current_recruiter),
):
    """Delete a specific thread."""
    recruiter_id = UUID(recruiter["id"])
    deleted = await delete_thread(thread_id=thread_id, recruiter_id=recruiter_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Thread not found")
    return {"message": "Thread deleted"}


@router.post("/threads/{thread_id}/chat")
async def chat_in_thread(
    thread_id: UUID,
    body: ChatRequest,
    recruiter=Security(get_current_recruiter),
):
    """Send a message in a thread. Returns a streaming SSE response."""
    recruiter_id = UUID(recruiter["id"])

    # Verify thread belongs to this recruiter
    thread = await get_thread_by_id(
        thread_id=thread_id, recruiter_id=recruiter_id
    )
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
        
    # Auto-rename "New thread" to the first message
    if thread["title"] == "New thread" and body.message.strip():
        new_title = body.message.strip()[:60]
        if len(body.message.strip()) > 60:
            new_title += "..."
        await update_thread_title(thread_id, new_title)

    return StreamingResponse(
        stream_agent_response(
            thread_id=str(thread_id),
            message=body.message,
        ),
        media_type="text/plain",
    )


@router.get("/threads/{thread_id}/messages")
async def get_thread_messages(
    thread_id: UUID,
    recruiter=Security(get_current_recruiter),
):
    """
    Fetch conversation history for a thread.
    Uses LangGraph checkpointer to load state and returns
    a list of {role, content} message objects.
    """
    recruiter_id = UUID(recruiter["id"])

    # Confirm thread belongs to this recruiter
    thread = await get_thread_by_id(thread_id=thread_id, recruiter_id=recruiter_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
    import os

    messages = []
    
    # We use the DATABASE_URL with sslmode=require for the checkpointer
    try:
        async with AsyncPostgresSaver.from_conn_string(os.getenv("DATABASE_URL")) as checkpointer:
            config = {"configurable": {"thread_id": str(thread_id)}}
            checkpoint_tuple = await checkpointer.aget_tuple(config)
            
            if not checkpoint_tuple:
                return {"messages": []}
                
            raw_messages = checkpoint_tuple.checkpoint.get("channel_values", {}).get("messages", [])
            
            for msg in raw_messages:
                msg_type = getattr(msg, "type", "")
                content = getattr(msg, "content", "")
                
                if not content:
                    continue
                    
                if msg_type in ("human", "user"):
                    messages.append({"role": "user", "content": content})
                elif msg_type in ("ai", "assistant"):
                    if isinstance(content, list):
                        # Extract text parts from content blocks
                        text = " ".join(
                            part.get("text", "") for part in content
                            if isinstance(part, dict) and part.get("type") == "text"
                        )
                        if text:
                            messages.append({"role": "assistant", "content": text})
                    elif isinstance(content, str) and content:
                        messages.append({"role": "assistant", "content": content})

    except Exception as e:
        print(f"Error fetching history: {e}")
        pass

    return {"messages": messages}