from pydantic import (
    BaseModel,
    EmailStr,
    Field,
)

from src.schemas.user import UserResponse


class RegisterRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user: UserResponse


class MessageResponse(BaseModel):
    status: str
    message: str