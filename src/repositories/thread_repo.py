from uuid import UUID
from src.database import get_db


async def create_thread(recruiter_id: UUID, title: str) -> dict:
    pool = await get_db()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO chat_threads (recruiter_id, title)
            VALUES ($1, $2)
            RETURNING id, recruiter_id, title, created_at
            """,
            recruiter_id,
            title,
        )
        return dict(row)


async def get_threads_by_recruiter(recruiter_id: UUID) -> list[dict]:
    pool = await get_db()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, recruiter_id, title, created_at, updated_at
            FROM chat_threads
            WHERE recruiter_id = $1
            ORDER BY updated_at DESC
            """,
            recruiter_id,
        )
        return [dict(r) for r in rows]


async def get_thread_by_id(thread_id: UUID, recruiter_id: UUID) -> dict | None:
    pool = await get_db()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT id, recruiter_id, title, created_at, updated_at
            FROM chat_threads
            WHERE id = $1 AND recruiter_id = $2
            """,
            thread_id,
            recruiter_id,
        )
        return dict(row) if row else None


async def update_thread_title(thread_id: UUID, title: str) -> None:
    pool = await get_db()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE chat_threads SET title = $1 WHERE id = $2",
            title,
            thread_id,
        )


async def delete_thread(thread_id: UUID, recruiter_id: UUID) -> bool:
    pool = await get_db()
    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM chat_threads WHERE id = $1 AND recruiter_id = $2",
            thread_id,
            recruiter_id,
        )
        return result == "DELETE 1"