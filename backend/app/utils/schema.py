from pydantic import BaseModel, Field, model_validator
from datetime import datetime
from typing import Optional
from uuid import UUID


# Auth
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


# Notes
class NoteCreate(BaseModel):
    title: str = Field(min_length=1)
    content: Optional[str] = ""


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    updated_at: datetime

    @model_validator(mode="after")
    def check_at_least_one_field(self):
        if self.title is None and self.content is None:
            raise ValueError("At least one of title or content must be provided")
        return self


class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    updated_at: datetime

    class Config:
        from_attributes = True
