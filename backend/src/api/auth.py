from fastapi import APIRouter, Response, status

from src.api.dependencies import AuthServiceDep
from src.config.settings import settings
from src.schemas.auth import (
    AuthResponse,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
)
from src.schemas.user import UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    data: RegisterRequest,
    service: AuthServiceDep,
):
    return await service.register(data)


@router.post(
    "/login",
    response_model=AuthResponse,
)
async def login(
    data: LoginRequest,
    response: Response,
    service: AuthServiceDep,
):
    user, token = await service.login(data)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )

    return {"user": user}


@router.post(
    "/logout",
    response_model=MessageResponse,
)
async def logout(
    response: Response,
):
    response.delete_cookie(
        key="access_token",
        path="/",
    )

    return {
        "status": "ok",
        "message": "Logged out",
    }
