from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI

from src.api.dependencies import (
    get_auth_service,
    get_current_user,
    get_monitor_service,
)
from src.api.router import api_router
from tests.factories import make_user


@pytest.fixture
def current_user():
    return make_user()


@pytest.fixture
def auth_service():
    return AsyncMock()


@pytest.fixture
def monitor_service():
    return AsyncMock()


@pytest.fixture
def api_app(
    current_user,
    auth_service,
    monitor_service,
):
    app = FastAPI()
    app.include_router(
        api_router,
        prefix="/api/v1",
    )

    async def override_user():
        return current_user

    def override_auth_service():
        return auth_service

    def override_monitor_service():
        return monitor_service

    app.dependency_overrides[
        get_current_user
    ] = override_user

    app.dependency_overrides[
        get_auth_service
    ] = override_auth_service

    app.dependency_overrides[
        get_monitor_service
    ] = override_monitor_service

    yield app

    app.dependency_overrides.clear()
