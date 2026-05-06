import asyncio
import sys
import os

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from dotenv import load_dotenv
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

load_dotenv()

async def init_database():
    """Initialize the database schema for LanGraph checkpointer."""
    try:
        async with AsyncPostgresSaver.from_conn_string(
            os.getenv("DATABASE_URL"),
            pipeline=False  
        ) as checkpointer:
            await checkpointer.setup()
            print("✅ Database initialized successfully!")
            print("✅ chat_threads table and LanGraph checkpoint tables created!")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(init_database())
