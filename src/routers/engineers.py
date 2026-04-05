from fastapi import APIRouter,Depends
from src.models.engineer import EngineerCreate,EngineerPublic,EngineerUpdate
from src.repositories.engineer_repo import create_engineer,search_engineers,update_engineer
from src.database import get_db
from fastapi import HTTPException
from src.auth import create_access_token,verify_password
from src.repositories.engineer_repo import get_engineer_by_email
from src.models.admin import AdminLoginRequest
from src.auth import get_current_recruiter
from typing import List
from src.models.engineer import EngineerSearchFilter

router=APIRouter(
    prefix="/engineers",
    tags=["Engineers"]
)

@router.post("/", response_model=EngineerPublic)
async def create_engineer_route(
    engineer: EngineerCreate
):
    new_engineer = await create_engineer(engineer)
    return dict(new_engineer)

@router.get("/", response_model=list[EngineerPublic])
async def get_all_engineers():
    engineers = await search_engineers()
    return [dict(e) for e in engineers]


@router.post("/login")
async def engineer_login(body: AdminLoginRequest):
    engineer = await get_engineer_by_email(body.email)
    if not engineer:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(body.password, engineer["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={
        "sub": engineer["email"],
        "role": "engineer",
        "id": str(engineer["id"])
    })

    return {"access_token": token, "token_type": "bearer"}

@router.put("/{engineer_id}", response_model=EngineerPublic)
async def update_engineer_route(
    engineer_id: str,
    body: EngineerUpdate,
    engineer=Depends(get_current_recruiter)
):
    if engineer["id"] != engineer_id:
        raise HTTPException(status_code=403, detail="You can only update your own profile")

    result = await update_engineer(engineer_id, body)
    
    if not result:
        raise HTTPException(status_code=404, detail="Engineer not found")
    
    return result

@router.post("/search", response_model=List[EngineerPublic])
async def search_engineers_route(
    filters: EngineerSearchFilter,
    recruiter=Depends(get_current_recruiter)
):
    results = await search_engineers(filters)
    return results