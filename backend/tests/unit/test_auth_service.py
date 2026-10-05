from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException

from src.schemas.auth import (
    LoginRequest,
    RegisterRequest,
)
from src.services import auth_service as auth_module
from src.services.auth_service import AuthService
from tests.factories import make_user


@pytest.fixture
def db():
    value = AsyncMock()
    value.commit = AsyncMock()
    return value


@pytest.fixture
def users():
    value = AsyncMock()
    value.get_by_email = AsyncMock()
    value.create = AsyncMock()
    return value


@pytest.mark.asyncio
async def test_register_creates_user_and_commits(
    db,
    users,
    monkeypatch,
):
    users.get_by_email.return_value = None
    created_user = make_user()

    users.create.return_value = created_user

    monkeypatch.setattr(
        auth_module,
        "hash_password",
        lambda password: "hashed",
    )

    service = AuthService(
        db=db,
        users=users,
    )

    result = await service.register(
        RegisterRequest(
            email="user@example.com",
            password="password123",
        )
    )

    assert result is created_user
    users.create.assert_awaited_once_with(
        email="user@example.com",
        password_hash="hashed",
    )
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_register_rejects_duplicate_email(
    db,
    users,
):
    users.get_by_email.return_value = (
        make_user()
    )

    service = AuthService(
        db=db,
        users=users,
    )

    with pytest.raises(
        HTTPException
    ) as error:
        await service.register(
            RegisterRequest(
                email="user@example.com",
                password="password123",
            )
        )

    assert error.value.status_code == 409
    users.create.assert_not_awaited()
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_login_returns_token_for_valid_credentials(
    db,
    users,
    monkeypatch,
):
    user = make_user()
    users.get_by_email.return_value = user

    monkeypatch.setattr(
        auth_module,
        "verify_password",
        lambda plain, hashed: True,
    )
    monkeypatch.setattr(
        auth_module,
        "create_access_token",
        lambda user_id: "jwt-token",
    )

    service = AuthService(
        db=db,
        users=users,
    )

    result_user, token = await service.login(
        LoginRequest(
            email="user@example.com",
            password="password123",
        )
    )

    assert result_user is user
    assert token == "jwt-token"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("existing_user", "password_valid", "expected_status"),
    [
        (None, True, 401),
        (make_user(), False, 401),
        (make_user(is_active=False), True, 403),
    ],
)
async def test_login_rejects_invalid_cases(
    db,
    users,
    monkeypatch,
    existing_user,
    password_valid,
    expected_status,
):
    users.get_by_email.return_value = (
        existing_user
    )

    monkeypatch.setattr(
        auth_module,
        "verify_password",
        lambda plain, hashed: password_valid,
    )

    service = AuthService(
        db=db,
        users=users,
    )

    with pytest.raises(
        HTTPException
    ) as error:
        await service.login(
            LoginRequest(
                email="user@example.com",
                password="password123",
            )
        )

    assert error.value.status_code == expected_status
