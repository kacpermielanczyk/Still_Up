from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.config.database import get_db
from src.models.user import User
from src.repositories.incident_repository import IncidentRepository
from src.repositories.monitor_check_repository import MonitorCheckRepository
from src.repositories.monitor_repository import MonitorRepository
from src.repositories.user_repository import UserRepository
from src.services.auth_service import AuthService
from src.services.monitor_check_service import MonitorCheckService
from src.services.monitor_service import MonitorService
from src.services.user_service import UserService
from src.utils.security import decode_access_token


DbSession = Annotated[
    AsyncSession,
    Depends(get_db),
]


async def get_current_user(
    request: Request,
    db: DbSession,
    access_token: Annotated[
        str | None,
        Cookie(),
    ] = None,
) -> User:
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    user_id = decode_access_token(
        access_token
    )

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    repository = UserRepository(db)
    user = await repository.get_by_id(
        user_id
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    request.state.user = user
    return user


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]


def get_auth_service(
    db: DbSession,
) -> AuthService:
    return AuthService(
        db=db,
        users=UserRepository(db),
    )


AuthServiceDep = Annotated[
    AuthService,
    Depends(get_auth_service),
]


def get_monitor_check_service(
    db: DbSession,
) -> MonitorCheckService:
    return MonitorCheckService(
        db=db,
        checks=MonitorCheckRepository(db),
        incidents=IncidentRepository(db),
    )


def get_monitor_service(
    db: DbSession,
) -> MonitorService:
    check_service = get_monitor_check_service(db)

    return MonitorService(
        db=db,
        monitors=MonitorRepository(db),
        checks=MonitorCheckRepository(db),
        incidents=IncidentRepository(db),
        check_service=check_service,
    )


MonitorServiceDep = Annotated[
    MonitorService,
    Depends(get_monitor_service),
]


def get_user_service() -> UserService:
    return UserService()


UserServiceDep = Annotated[
    UserService,
    Depends(get_user_service),
]
