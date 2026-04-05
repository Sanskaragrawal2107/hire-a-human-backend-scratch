import asyncio
from fastmcp import FastMCP
from fastmcp.server.lifespan import lifespan

from src.models.engineer import EngineerSearchFilter
from src.repositories.engineer_repo import search_engineers as search_engineers_repo
from src.database import create_connection, disconnect_db

<<<<<<< HEAD
mcp = FastMCP("Hire-a-Human-mcp")
=======

@lifespan
async def app_lifespan(server):
    await create_connection()
    try:
        yield {}
    finally:
        await disconnect_db()


mcp = FastMCP(
    "Hire-a-Human-mcp",
    lifespan=app_lifespan
)
>>>>>>> 3dc8807595f958e9d5ee3f845fbd98d4043158f9


@mcp.tool
async def search_engineers(filters: EngineerSearchFilter):
    """Search for engineers by skills, location, experience. Returns ranked results."""
    return await search_engineers_repo(filters)
<<<<<<< HEAD


async def main():
    await create_connection()
    try:
        await mcp.run_async(transport="stdio")
    finally:
        await disconnect_db()


if __name__ == "__main__":
    asyncio.run(main())
=======
>>>>>>> 3dc8807595f958e9d5ee3f845fbd98d4043158f9
