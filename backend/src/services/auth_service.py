from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.repositories.user_repository import UserRepository
from src.schemas.auth import LoginRequest, RegisterRequest
from src.utils.security import (
    create_access_token,
    hash_password,
    verify_password,
)


class AuthService:
    def __init__(
        self,
        db: AsyncSession,
        users: UserRepository,
    ):
        self.db = db
        self.users = users

    async def register(
        self,
        data: RegisterRequest,
    ):
        existing_user = await self.users.get_by_email(
            data.email
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        user = await self.users.create(
            email=data.email,
            password_hash=hash_password(
                data.password
            ),
        )

        await self.db.commit()

        return user

    async def login(
        self,
        data: LoginRequest,
    ):
        user = await self.users.get_by_email(
            data.email
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not verify_password(
            data.password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        token = create_access_token(
            user.id
        )

        return user, token
