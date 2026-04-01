from src.database import get_db

async def get_admin_by_email(email:str):
    pool=await get_db()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM admins WHERE email = $1",
            email
        )
        return dict(row) if row else None

