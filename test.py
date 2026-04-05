import httpx
import asyncio

async def test():
    async with httpx.AsyncClient(timeout=60) as client:
        async with client.stream(
            "POST",
            "http://127.0.0.1:8000/agent/threads/750847e0-c49b-488a-b473-c75733b0681c/chat",
            json={"message": "hi what can you do?"},
            headers={"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDYW1wdXN4QGdtYWlsLmNvbSIsInZlcmlmaWNhdGlvbl9zdGF0dXMiOiJ2ZXJpZmllZCIsInJvbGUiOiJyZWNydWl0ZXIiLCJpZCI6IjFmYzA5NDhkLWU5YTUtNDI3Mi05OWE3LTc5MGFjMGMxOTkxZiIsImV4cCI6MTc3NTQwODgwMH0.1iwZfr-gFguOzc_JOwwNx4ieH6G6z_RBG_GVT-pNz_M"}
        ) as response:
            async for chunk in response.aiter_text():
                print(chunk, end="", flush=True)

asyncio.run(test())