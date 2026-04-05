from uuid import UUID

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

    return StreamingResponse(
        stream_agent_response(
            thread_id=str(thread_id),
            message=body.message,
        ),
        media_type="text/plain",
    )