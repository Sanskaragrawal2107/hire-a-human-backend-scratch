import os
from typing import AsyncGenerator
import traceback

from deepagents import create_deep_agent
from fastmcp.client import Client as FastMCPClient
from fastmcp.client.transports import StreamableHttpTransport
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain_openrouter import ChatOpenRouter
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver


SYSTEM_PROMPT = """
You are the recruiter assistant for Hire a Human.

Your job is to help recruiters find relevant engineers.
When the user asks to search, filter, shortlist, or compare candidates,
use the available MCP tools.

You also have access to GitHub and LeetCode tools to verify engineer skills:
- Use GitHub tools to check if their repositories show real coding work.
- Use LeetCode tools to check their problem-solving activity.

Do not invent engineer profiles or candidate details.
If tool results are insufficient, say so clearly.
"""


def get_model():
    return ChatOpenRouter(
        model="z-ai/glm-4.5-air:free",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )


# Servers config: name -> (url, token)
_MCP_SERVERS: dict[str, tuple[str, str]] = {
    "hire_a_human_mcp": (
        os.getenv("MCP_SERVER_URL", ""),
        os.getenv("MCP_TOKEN", ""),
    ),
    "leetcode_mcp": (
        os.getenv("LEETCODE_MCP_URL", ""),
        os.getenv("MCP_TOKEN", ""),
    ),
}


async def _load_tools_from_server(name: str, url: str, token: str) -> list:
    """Connect to a single FastMCP-hosted server and return LangChain tools.

    Uses FastMCP's own StreamableHttpTransport (backed by mcp 1.x
    streamable_http_client) which is fully compatible with fastmcp.app
    hosted servers.  The raw ClientSession is then passed to
    langchain_mcp_adapters.load_mcp_tools to produce LangChain tool objects.
    """
    transport = StreamableHttpTransport(
        url=url,
        headers={"Authorization": f"Bearer {token}"},
    )
    client = FastMCPClient(transport)
    async with client:
        # client.session is the live mcp.ClientSession — pass it directly to
        # load_mcp_tools so langchain-mcp-adapters wraps it as LangChain tools.
        tools = await load_mcp_tools(client.session)
    return tools


async def get_mcp_tools() -> list:
    """Load MCP tools from all configured servers with graceful error handling."""
    all_tools: list = []
    for name, (url, token) in _MCP_SERVERS.items():
        if not url:
            print(f"⚠️  {name}: URL not configured, skipping")
            continue
        try:
            tools = await _load_tools_from_server(name, url, token)
            print(f"✅ {name}: {len(tools)} tools loaded")
            all_tools.extend(tools)
        except Exception as e:
            print(f"⚠️  {name}: Failed — {str(e)[:300]}")
            traceback.print_exc()

    print(f"📦 Total tools available: {len(all_tools)}")
    return all_tools


async def stream_agent_response(
    thread_id: str,
    message: str,
) -> AsyncGenerator[str, None]:
    """Stream agent response with robust error handling."""
    try:
        tools = await get_mcp_tools()
        model = get_model()

        async with AsyncPostgresSaver.from_conn_string(
            os.getenv("DATABASE_URL"),
            pipeline=False,
        ) as checkpointer:
            await checkpointer.setup()

            agent = create_deep_agent(
                model=model,
                tools=tools,
                checkpointer=checkpointer,
                system_prompt=SYSTEM_PROMPT,
            )

            config = {"configurable": {"thread_id": thread_id}}

            async for event in agent.astream_events(
                {"messages": [{"role": "user", "content": message}]},
                config=config,
                version="v2",
            ):
                kind = event["event"]

                if kind == "on_tool_start":
                    tool_name = event["name"]
                    yield f"🔧 Calling: {tool_name}\n"

                elif kind == "on_tool_end":
                    tool_name = event["name"]
                    yield f"✅ Done: {tool_name}\n"

                elif kind == "on_chat_model_stream":
                    chunk = event["data"]["chunk"]
                    if hasattr(chunk, "content") and chunk.content:
                        yield chunk.content
    
    except Exception as e:
        error_msg = f"Agent error: {str(e)}"
        print(f"❌ {error_msg}")
        traceback.print_exc()
        yield error_msg