from src.database import get_db
from src.models.recruiters import RecruiterCreate, RecruiterInDB, RecruiterPublic, RecruiterStatus
import bcrypt
import json
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_recruiter(recruiter:RecruiterCreate):
    password_hash=bcrypt.hashpw(
        recruiter.password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    pool=await get_db()
    async with pool.acquire() as conn:
        res=await conn.fetchrow(
            "insert into recruiters (company_name,company_email,company_gstin,password_hash) values ($1,$2,$3,$4) RETURNING *",recruiter.company_name,recruiter.company_email,recruiter.company_gstin,password_hash
        )
        return res
    
async def get_recruiter_by_id(id):
    pool=await get_db()
    async with pool.acquire() as conn:
        res=await conn.fetchrow(
            "select * from recruiters where id=$1",id
        )
        return res

async def update_recruiter(recruiter_id: str, company_name: str = None, company_gstin: str = None):
    pool=await get_db()
    async with pool.acquire() as conn:
        res=await conn.fetchrow(
            """
            update recruiters 
            set company_name=Coalesce($1,company_name),
            company_gstin=Coalesce($2,company_gstin) where id = $3 
            RETURNING *
            """,
            company_name,company_gstin,recruiter_id
        )
        return res
    
async def verify_recruiter(recruiter_id: str, status: str, reviewed_by: str, rejection_msg: str = None):
    pool = await get_db()
    async with pool.acquire() as conn:
        # Check current status first
        existing = await conn.fetchrow(
            "SELECT verification_status FROM recruiters WHERE id = $1",
            recruiter_id
        )

        if not existing:
            raise Exception("Recruiter not found")

        if existing["verification_status"] == "verified":
            raise Exception("Recruiter is already verified")

        await conn.execute(
            """
            UPDATE recruiters
            SET verification_status = $1, updated_at = NOW()
            WHERE id = $2
            """,
            status, recruiter_id
        )

        res = await conn.fetchrow(
    """
    INSERT INTO recruiter_verifications (recruiter_id, reviewed_by, status, rejection_msg, reviewed_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING *
    """,
    recruiter_id, reviewed_by, status, rejection_msg
)

        return dict(res) if res else None

async def get_recruiter_by_email(email: str):
    pool = await get_db()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM recruiters WHERE company_email = $1",
            email
        )
        return dict(row) if row else None   
