from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from starlette.requests import Request

from src.api import dependencies
from tests.factories import make_user


def make_request() -> Request:
    return Request(
        {
            "type": "http",
            "method": "GET",
            "path": "/",
            "headers": [],
            "query_string": b"",
            "server": ("testserver", 80),
            "client": ("127.0.0.1", 1234),
            "scheme": "http",
        }
    )


@pytest.mark.asyncio
async def test_current_user_requires_cookie():
    with pytest.raises(
        HTTPException
    ) as error:
        await dependencies.get_current_user(
            request=make_request(),
            db=AsyncMock(),
            access_token=None,
        )

    assert error.value.status_code == 401


@pytest.mark.asyncio
async def test_current_user_rejects_invalid_token(
    monkeypatch,
):
    monkeypatch.setattr(
        dependencies,
        "decode_access_token",
        lambda token: None,
    )

    with pytest.raises(
        HTTPException
    ) as error:
        await dependencies.get_current_user(
            request=make_request(),
            db=AsyncMock(),
            access_token="bad-token",
        )

    assert error.value.status_code == 401


@pytest.mark.asyncio
async def test_current_user_is_attached_to_request(
    monkeypatch,
):
    user = make_user()

    monkeypatch.setattr(
        dependencies,
        "decode_access_token",
        lambda token: user.id,
    )

    repository = AsyncMock()
    repository.get_by_id.return_value = user

    monkeypatch.setattr(
        dependencies,
        "UserRepository",
        lambda db: repository,
    )

    request = make_request()

    result = await dependencies.get_current_user(
        request=request,
        db=AsyncMock(),
        access_token="good-token",
    )

    assert result is user
    assert request.state.user is user


@pytest.mark.asyncio
async def test_current_user_rejects_inactive_account(
    monkeypatch,
):
    user = make_user(
        is_active=False
    )

    monkeypatch.setattr(
        dependencies,
        "decode_access_token",
        lambda token: user.id,
    )

    repository = AsyncMock()
    repository.get_by_id.return_value = user

    monkeypatch.setattr(
        dependencies,
        "UserRepository",
        lambda db: repository,
    )

    with pytest.raises(
        HTTPException
    ) as error:
        await dependencies.get_current_user(
            request=make_request(),
            db=AsyncMock(),
            access_token="token",
        )

    assert error.value.status_code == 403
