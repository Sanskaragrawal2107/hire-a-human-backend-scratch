from fastmcp import FastMCP
from fastmcp.server.lifespan import lifespan

from src.models.engineer import EngineerSearchFilter
from src.repositories.engineer_repo import search_engineers as search_engineers_repo
from src.database import create_connection, disconnect_db


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


@mcp.tool
async def search_engineers(filters: EngineerSearchFilter):
    """Search for engineers by skills, location, experience. Returns ranked results."""
    return await search_engineers_repo(filters)
