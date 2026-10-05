from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

from src.api.dependencies import (
    get_current_user,
    get_monitor_service,
)
from src.api.monitors import router as monitors_router


def test_monitor_routes_require_authenticated_user():
    app = FastAPI()
    app.include_router(
        monitors_router,
        prefix="/api/v1",
    )

    async def reject_user():
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    class DummyService:
        pass

    app.dependency_overrides[
        get_current_user
    ] = reject_user

    app.dependency_overrides[
        get_monitor_service
    ] = lambda: DummyService()

    with TestClient(app) as client:
        response = client.get(
            "/api/v1/monitors"
        )

    assert response.status_code == 401
