from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID

# ---------- Auth ----------
class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: UUID
    username: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ---------- Notes ----------
class NoteCreate(BaseModel):
    title: str = Field(min_length=1)
    content: Optional[str] = ""

class NoteUpdate(BaseModel):
    title: str
    content: Optional[str] = ""
    updated_at: datetime

class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    updated_at: datetime
    class Config:
        from_attributes = True