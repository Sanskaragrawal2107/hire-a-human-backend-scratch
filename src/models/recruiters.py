from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from enum import Enum


class RecruiterStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class SubscriptionTier(str, Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"


class RecruiterCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255)
    company_email: EmailStr
    password: str = Field(..., min_length=8)
    company_gstin: Optional[str] = Field(None, min_length=15, max_length=15)


class RecruiterInDB(BaseModel):
    id: UUID
    company_name: str
    company_email: EmailStr
    password_hash: str
    company_gstin: Optional[str] = None
    is_email_verified: bool = False
    verification_status: RecruiterStatus = RecruiterStatus.pending
    subscription_tier: SubscriptionTier = SubscriptionTier.free
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RecruiterPublic(BaseModel):
    id: UUID
    company_name: str
    verification_status: RecruiterStatus
    subscription_tier: SubscriptionTier

class RecruiterReviewRequest(BaseModel):
    status: RecruiterStatus
    rejection_msg: Optional[str] = None