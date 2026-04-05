import os
from typing import AsyncGenerator

from deepagents import create_deep_agent
from langchain_mcp_adapters.client import MultiServerMCPClient
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
        model="qwen/qwen3.6-plus:free",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )


async def get_mcp_tools():
    client = MultiServerMCPClient(
        {
            "hire_a_human_mcp": {
                "transport": "streamable_http",
                "url": os.getenv("MCP_SERVER_URL"),
                "headers": {
                    "Authorization": f"Bearer {os.getenv('MCP_TOKEN')}"
                },
            },
            "leetcode_mcp": {
                "transport": "streamable_http",
                "url": os.getenv("LEETCODE_MCP_URL"),
                "headers": {
                    "Authorization": f"Bearer {os.getenv('MCP_TOKEN')}"
                },
            },
            "github_mcp": {
                "transport": "streamable_http",
                "url": "https://api.githubcopilot.com/mcp/",
                "headers": {
                    "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}"
                },
            },
        }
    )
    return await client.get_tools()


async def stream_agent_response(
    thread_id: str,
    message: str,
) -> AsyncGenerator[str, None]:
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