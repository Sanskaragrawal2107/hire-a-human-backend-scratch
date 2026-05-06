from fastmcp import FastMCP
from contextlib import asynccontextmanager

from src.models.engineer import EngineerSearchFilter
from src.repositories.engineer_repo import search_engineers as search_engineers_repo
from src.database import create_connection, disconnect_db


@asynccontextmanager
async def app_lifespan(server):
    try:
        await create_connection()
    except Exception as e:
        import logging
        logging.error(f"Lifespan DB setup error: {e}")
    try:
        yield {}
    finally:
        try:
            await disconnect_db()
        except Exception:
            pass


mcp = FastMCP(
    "Hire-a-Human-mcp",
    lifespan=app_lifespan,
)


@mcp.tool
async def search_engineers(filters: EngineerSearchFilter):
    """Search for engineers by skills, location, experience. Returns ranked results."""
    return await search_engineers_repo(filters)
