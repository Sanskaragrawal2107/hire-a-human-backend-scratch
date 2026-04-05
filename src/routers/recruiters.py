from fastapi import APIRouter
from src.models.recruiters import RecruiterCreate, RecruiterPublic
from src.repositories.recruiter_repo import create_recruiter,get_recruiter_by_email
from src.models.admin import AdminLoginRequest
from fastapi import HTTPException
from src.auth import create_access_token,verify_password
router=APIRouter(
    prefix="/recruiters",
    tags=["Recruiters"]
)

@router.post("/",response_model=RecruiterPublic)
async def signup_recruiter(
    recruiter: RecruiterCreate
):
    new_recruiter = await create_recruiter(recruiter)
    return dict(new_recruiter)

@router.post("/login")
async def recruiter_login(body: AdminLoginRequest):
    recruiter = await get_recruiter_by_email(body.email)

    if not recruiter:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(body.password, recruiter["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if str(recruiter["verification_status"]) == "rejected":
        raise HTTPException(status_code=403, detail="Your account has been rejected")

    token = create_access_token(data={
        "sub": recruiter["company_email"],
        "verification_status": str(recruiter["verification_status"]),
        "role": "recruiter",
        "id": str(recruiter["id"])
    })

    return {"access_token": token, "token_type": "bearer"}