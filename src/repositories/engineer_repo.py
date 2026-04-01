from src.database import get_db
from src.models.engineer import EngineerCreate,EngineerUpdate,EngineerSearchFilter
import bcrypt
import json


def _normalize_engineer(row):
    engineer = dict(row)
    if isinstance(engineer.get("skills"), str):
        engineer["skills"] = json.loads(engineer["skills"])
    engineer.pop("relevance_score", None)
    return engineer

async def create_engineer(engineer: EngineerCreate):
    password_hash=bcrypt.hashpw(
        engineer.password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    pool = await get_db()
    async with pool.acquire() as conn:
        result = await conn.fetchrow(
            "insert into engineers (full_name,email,password_hash,curr_location,preferred_location,github_username,leetcode_username,skills,experience_years,job_type,bio) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",engineer.full_name,engineer.email,password_hash,engineer.curr_location,engineer.preferred_location,engineer.github_username,engineer.leetcode_username,json.dumps(engineer.skills),engineer.experience_years,engineer.job_type,engineer.bio
        )
        return _normalize_engineer(result)

async def get_engineer_by_id(engineer_id:str):
    pool = await get_db()
    async with pool.acquire() as conn:
        res=await conn.fetchrow("select * from engineers where id=$1",engineer_id)
    return _normalize_engineer(res) if res else None


async def update_engineer(engineer_id: str, data: EngineerUpdate):
    pool = await get_db()
    async with pool.acquire() as conn:
        result = await conn.fetchrow(
            """
            UPDATE engineers
            SET bio = COALESCE($1, bio),
                curr_location = COALESCE($2, curr_location),
                preferred_location = COALESCE($3, preferred_location),
                skills = COALESCE($4::jsonb, skills),
                job_type = COALESCE($5::enum_job_type, job_type),
                is_open_to_hire = COALESCE($6, is_open_to_hire)
            WHERE id = $7
            RETURNING *
            """,
            data.bio,
            data.curr_location,
            data.preferred_location,
            json.dumps(data.skills) if data.skills else None,
            data.job_type.value if data.job_type else None,
            data.is_open_to_hire,
            engineer_id
        )
    return _normalize_engineer(result) if result else None

async def delete_engineer(engineer_id: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        await conn.execute(
            "DELETE FROM engineers WHERE id = $1",
            engineer_id
        )

async def get_engineer_by_email(email: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM engineers WHERE email = $1",
            email
        )
        return dict(row) if row else None
    
async def search_engineers(filters: EngineerSearchFilter):
    pool = await get_db()
    async with pool.acquire() as conn:

        query = """
        SELECT *,
        
        (
            SELECT COUNT(*) * 10
            FROM jsonb_array_elements_text(skills) AS skill
            WHERE skill = ANY($1::text[])
        )
        +
        CASE 
            WHEN $2::int IS NOT NULL AND experience_years > $2::int 
            THEN (experience_years - $2::int) * 2
            ELSE 0
        END
        +
        CASE 
            WHEN $3::text IS NOT NULL AND preferred_location ILIKE $3::text 
            THEN 5
            ELSE 0
        END
        +
        CASE 
            WHEN is_open_to_hire = TRUE 
            THEN 3
            ELSE 0
        END

        AS relevance_score

        FROM engineers
        WHERE 1=1
        """

        params = [
            filters.skills if filters.skills else [],           
            filters.min_experience,                            
            f"%{filters.preferred_location}%" if filters.preferred_location else None  # $3
        ]
        i = 4

        if filters.min_experience is not None:
            query += f" AND experience_years >= ${i}"
            params.append(filters.min_experience)
            i += 1

        if filters.job_type:
            query += f" AND job_type = ${i}::enum_job_type"
            params.append(filters.job_type.value)
            i += 1

        if filters.is_open_to_hire is not None:
            query += f" AND is_open_to_hire = ${i}"
            params.append(filters.is_open_to_hire)
            i += 1

        if filters.skills:
            query += """
            AND EXISTS (
                SELECT 1 FROM jsonb_array_elements_text(skills) s
                WHERE s = ANY($1::text[])
            )
            """

        query += f" ORDER BY relevance_score DESC LIMIT ${i}"
        params.append(filters.limit)

        results = await conn.fetch(query, *params)
        return [_normalize_engineer(r) for r in results]