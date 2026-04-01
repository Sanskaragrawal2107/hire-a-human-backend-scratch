import asyncio
from fastmcp import FastMCP
from src.models.engineer import EngineerSearchFilter
from src.repositories.engineer_repo import search_engineers as search_engineers_repo
from src.database import create_connection, disconnect_db

mcp = FastMCP("Hire-a-Human-mcp")


@mcp.tool
async def search_engineers(filters: EngineerSearchFilter):
    """Search for engineers by skills, location, experience. Returns ranked results."""
    return await search_engineers_repo(filters)


async def main():
    await create_connection()
    try:
        await mcp.run_async(transport="stdio")
    finally:
        await disconnect_db()


if __name__ == "__main__":
    asyncio.run(main())
