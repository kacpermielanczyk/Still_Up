import httpx
import pytest
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import StaticPool

import src.models  # noqa: F401
from src.api.router import api_router
from src.config.database import Base, get_db


@pytest.mark.asyncio
async def test_register_login_and_monitor_crud_flow():
    """
    API -> dependency -> service -> repository -> SQLAlchemy -> DB.
    """
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        poolclass=StaticPool,
    )

    async with engine.begin() as connection:
        await connection.run_sync(
            Base.metadata.create_all
        )

    session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    app = FastAPI()
    app.include_router(
        api_router,
        prefix="/api/v1",
    )

    async def override_db():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[
        get_db
    ] = override_db

    transport = httpx.ASGITransport(
        app=app
    )

    async with httpx.AsyncClient(
        transport=transport,
        base_url="http://testserver",
    ) as client:
        register = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "e2e@example.com",
                "password": "password123",
            },
        )

        assert register.status_code == 201

        duplicate = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "e2e@example.com",
                "password": "password123",
            },
        )

        assert duplicate.status_code == 409

        wrong_login = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "e2e@example.com",
                "password": "wrong-password",
            },
        )

        assert wrong_login.status_code == 401

        login = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "e2e@example.com",
                "password": "password123",
            },
        )

        assert login.status_code == 200
        assert (
            client.cookies.get(
                "access_token"
            )
            is not None
        )

        me = await client.get(
            "/api/v1/users/me"
        )

        assert me.status_code == 200
        assert me.json()["email"] == (
            "e2e@example.com"
        )

        create = await client.post(
            "/api/v1/monitors",
            json={
                "name": "Portfolio",
                "resource_type": "website",
                "url": "https://example.com",
                "method": "GET",
                "interval_seconds": 60,
                "timeout_seconds": 5,
                "expected_status_code": 200,
            },
        )

        assert create.status_code == 201

        monitor_id = create.json()["id"]

        listing = await client.get(
            "/api/v1/monitors"
        )

        assert listing.status_code == 200
        assert len(listing.json()) == 1

        details = await client.get(
            f"/api/v1/monitors/{monitor_id}"
        )

        assert details.status_code == 200
        assert details.json()["name"] == (
            "Portfolio"
        )

        update = await client.patch(
            f"/api/v1/monitors/{monitor_id}",
            json={
                "enabled": False,
            },
        )

        assert update.status_code == 200
        assert update.json()["enabled"] is False

        stats = await client.get(
            f"/api/v1/monitors/{monitor_id}/stats"
        )

        assert stats.status_code == 200
        assert stats.json()["total_checks"] == 0
        assert (
            stats.json()["uptime_percentage"]
            == 0.0
        )

        delete = await client.delete(
            f"/api/v1/monitors/{monitor_id}"
        )

        assert delete.status_code == 204

        missing = await client.get(
            f"/api/v1/monitors/{monitor_id}"
        )

        assert missing.status_code == 404

        logout = await client.post(
            "/api/v1/auth/logout"
        )

        assert logout.status_code == 200

    app.dependency_overrides.clear()

    async with engine.begin() as connection:
        await connection.run_sync(
            Base.metadata.drop_all
        )

    await engine.dispose()
