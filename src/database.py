from dotenv import load_dotenv
import asyncpg
import os
load_dotenv()

db_user=os.getenv("DB_USER")
db_pas=os.getenv("DB_PASSWORD")
db_host=os.getenv("DB_HOST")
db_port=os.getenv("DB_PORT")
db_name=os.getenv("DB_NAME")

pool=None

async def create_connection():
   global pool
   pool=await asyncpg.create_pool(
        host=db_host,
        port=db_port,
        user=db_user,
        password=db_pas,
        database=db_name,
        min_size=2,
        max_size=10
    )
async def disconnect_db():
    global pool
    await pool.close()

async def get_db():
    global pool
    if pool is None:
        raise Exception("Database not initialized")
    return pool
