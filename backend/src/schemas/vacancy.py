from enum import Enum
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from datetime import datetime


class VacancyStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DRAFT = "draft"


class VacancyCreate(BaseModel):
    title: str = Field(..., max_length=100)
    description: str
    company_name: str = Field(..., max_length=100)
    company_address: Optional[str] = Field(None, max_length=200)
    logo: Optional[HttpUrl] = None
    hh_id: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "name": "Python Developer",
                "description": "We are looking for an experienced Python developer...",
                "company_name": "Tech Corp",
                "company_address": "Moscow, Tverskaya st. 1",
                "logo": "https://example.com/logo.png",
                "hh_id": "12345678"
            }
        }

class VacancyUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    status: Optional[VacancyStatus] = None
    company_name: Optional[str] = Field(None, max_length=100)
    company_address: Optional[str] = Field(None, max_length=200)
    logo: Optional[HttpUrl] = None
    is_active: Optional[bool] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "name": "Senior Python Developer",
                "description": "Updated job description...",
                "status": "active",
                "is_active": True
            }
        }

class VacancyResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    company: str
    address: Optional[str] = None
    logo: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_active: bool
    hh_id: Optional[str] = None

    class Config:
        from_attributes = True