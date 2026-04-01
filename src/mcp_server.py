from fastmcp import FastMCP
from .models.engineer import EngineerSearchFilter
from .repositories.engineer_repo import search_engineers as search_engineers_repo

mcp=FastMCP("Hire-a-Human-mcp")

@mcp.tool
async def search_engineers(filters:EngineerSearchFilter):
     """Search for engineers by skills, location, experience. Returns ranked results."""
     return await search_engineers_repo(filters)

if __name__ == "__main__":
    mcp.run(transport="stdio")