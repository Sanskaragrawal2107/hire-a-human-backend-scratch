from dotenv import load_dotenv
import asyncpg
import os
from pathlib import Path

# Load .env from the project root (where this file is located)
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

db_user = None
db_pas = None
db_host = None
db_port = None
db_name = None

pool = None

async def create_connection():
    global pool
    import logging
    try:
        # Load env vars dynamically in case they are set after import
        host = os.getenv("DB_HOST")
        port = os.getenv("DB_PORT", "5432")
        user = os.getenv("DB_USER")
        password = os.getenv("DB_PASSWORD")
        database = os.getenv("DB_NAME", "postgres")

        if not host or not user or not password:
            missing = []
            if not host: missing.append("DB_HOST")
            if not user: missing.append("DB_USER")
            if not password: missing.append("DB_PASSWORD")
            raise Exception(f"Database credentials missing: {', '.join(missing)}. Check .env file at {env_path}")

        pool = await asyncpg.create_pool(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            ssl='require',
            min_size=2,
            max_size=10
        )
        logging.info("Database connection pool created.")
    except Exception as e:
        logging.error(f"Failed to create database connection pool: {e}")
        raise

async def disconnect_db():
    global pool
    if pool is not None:
        try:
            await pool.close()
        except Exception:
            pass

async def get_db():
    global pool
    if pool is None:
        raise Exception("Database not initialized or connection failed.")
    return pool
