from pydantic import BaseModel,EmailStr,Field
from typing import Optional,List
from uuid import UUID
from datetime import datetime
from enum import Enum

class jobType(str,Enum):
    internship="internship"
    full_time="full_time"
    both="both"

class EngineerCreate(BaseModel):
    full_name:str = Field(...,min_length=2,max_length=255)
    email:EmailStr
    password:str=Field(...,min_length=8)
    curr_location:Optional[str] = None
    preferred_location: Optional[str] = None
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience_years:int = Field(default=0,ge=0,le=50)
    job_type:Optional[jobType] = None
    bio:Optional[str]= None

class EngineerInDB(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    password_hash: str
    curr_location: Optional[str] = None
    preferred_location: Optional[str] = None
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None
    skills: List[str] = []
    experience_years: int = 0
    job_type: Optional[jobType] = None
    bio: Optional[str] = None
    is_open_to_hire: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EngineerPublic(BaseModel):
    id: UUID
    full_name: str
    curr_location: Optional[str] = None
    preferred_location: Optional[str] = None
    github_username: Optional[str] = None
    skills: List[str] = []
    experience_years: int = 0
    job_type: Optional[jobType] = None
    bio: Optional[str] = None
    is_open_to_hire: bool = True

class EngineerUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    curr_location: Optional[str] = None
    preferred_location: Optional[str] = None
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None
    skills: Optional[List[str]] = None
    experience_years: Optional[int] = Field(None, ge=0, le=50)
    job_type: Optional[jobType] = None
    bio: Optional[str] = None
    is_open_to_hire: Optional[bool] = None

class EngineerSearchFilter(BaseModel):
    skills: Optional[List[str]] = None
    preferred_location: Optional[str] = None
    job_type: Optional[jobType] = None
    min_experience: Optional[int] = Field(None, ge=0, le=50)
    is_open_to_hire: Optional[bool] = None
    limit: int = Field(default=10, ge=1, le=50)