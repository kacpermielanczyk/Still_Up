from unittest.mock import AsyncMock, MagicMock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from src.api.health import router
from src.config.database import get_db


def build_app(fake_db):
    app = FastAPI()
    app.include_router(
        router,
        prefix="/api/v1",
    )

    async def override_db():
        yield fake_db

    app.dependency_overrides[
        get_db
    ] = override_db

    return app


def test_health_returns_database_and_migration_status():
    fake_db = AsyncMock()

    migration_result = MagicMock()
    migration_result.scalar_one_or_none.return_value = (
        "abc123"
    )

    fake_db.execute.side_effect = [
        MagicMock(),
        migration_result,
    ]

    app = build_app(fake_db)

    with TestClient(app) as client:
        response = client.get(
            "/api/v1/health"
        )

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "database": "ok",
        "migration": "abc123",
    }


def test_health_returns_503_when_database_fails():
    fake_db = AsyncMock()
    fake_db.execute.side_effect = RuntimeError(
        "database unavailable"
    )

    app = build_app(fake_db)

    with TestClient(app) as client:
        response = client.get(
            "/api/v1/health"
        )

    assert response.status_code == 503
    assert response.json()["detail"][
        "database"
    ] == "unavailable"
