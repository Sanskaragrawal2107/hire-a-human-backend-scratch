"""Confirm which endpoints exist on both servers"""
import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("MCP_TOKEN", "")
HAH_BASE = "https://HireAHumanmcp.fastmcp.app"
LEET_BASE = "https://Leetcode-mcp.fastmcp.app"

ENDPOINTS = ["/mcp", "/sse", "/", "/health"]

INIT_PAYLOAD = {
    "jsonrpc": "2.0", "id": 1, "method": "initialize",
    "params": {
        "protocolVersion": "2024-11-05",
        "capabilities": {},
        "clientInfo": {"name": "probe", "version": "1.0"},
    },
}

async def probe_endpoint(name, base, path):
    url = base + path
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }
    try:
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as c:
            r = await c.post(url, json=INIT_PAYLOAD, headers=headers)
            ct = r.headers.get("content-type", "")
            body_preview = r.text[:120].replace("\n", "\\n")
            print(f"  POST {path} => {r.status_code} | {ct} | {body_preview}")
    except Exception as e:
        print(f"  POST {path} => ERROR: {e}")

async def main():
    for name, base in [("HireAHuman", HAH_BASE), ("LeetCode", LEET_BASE)]:
        print(f"\n=== {name} ({base}) ===")
        for ep in ENDPOINTS:
            await probe_endpoint(name, base, ep)

asyncio.run(main())
