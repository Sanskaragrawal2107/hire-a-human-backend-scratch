from src.auth import create_access_token,get_current_admin,verify_password
from fastapi import APIRouter
from src.repositories.admin_repo import get_admin_by_email
from src.models.admin import AdminLoginRequest,TokenResponse
from src.repositories.recruiter_repo import verify_recruiter, get_all_recruiters
from src.models.recruiters import RecruiterReviewRequest, RecruiterPublic
from fastapi import HTTPException,Depends
from typing import List

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get("/recruiters", response_model=List[RecruiterPublic])
async def list_all_recruiters(admin=Depends(get_current_admin)):
    """List all recruiters for admin review."""
    recruiters = await get_all_recruiters()
    return recruiters

@router.post("/review-recruiter/{recruiter_id}")
async def review_recruiter(recruiter_id: str, body: RecruiterReviewRequest,admin=Depends(get_current_admin)):
    try:
        result = await verify_recruiter(
            recruiter_id=recruiter_id,
            status=body.status,
            reviewed_by=admin["id"],
            rejection_msg=body.rejection_msg
        )
        return {"message": f"Recruiter {body.status.value} successfully", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/login", response_model=TokenResponse)
async def admin_login(body: AdminLoginRequest):
    admin = await get_admin_by_email(body.email)

    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(body.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={
        "sub": admin["email"],
        "role": "admin",
        "id": str(admin["id"])

    })

    return {"access_token": token, "token_type": "bearer"}