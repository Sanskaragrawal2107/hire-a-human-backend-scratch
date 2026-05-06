from dotenv import load_dotenv
import asyncpg
import os
load_dotenv()

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
            logging.warning("Database credentials missing. Skipping DB connection.")
            return

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
