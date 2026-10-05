from datetime import datetime, timezone

from fastapi.testclient import TestClient

from src.models.enums import (
    CheckStatus,
    HttpMethod,
    MonitorStatus,
    ResourceType,
)
from src.models.incident import Incident
from src.models.monitor_check import MonitorCheck
from tests.factories import make_monitor


def test_list_monitors(
    api_app,
    monitor_service,
):
    monitor_service.get_all.return_value = [
        make_monitor()
    ]

    with TestClient(api_app) as client:
        response = client.get(
            "/api/v1/monitors"
        )

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_create_monitor(
    api_app,
    monitor_service,
):
    monitor_service.create.return_value = (
        make_monitor()
    )

    with TestClient(api_app) as client:
        response = client.post(
            "/api/v1/monitors",
            json={
                "name": "Example",
                "resource_type": "website",
                "url": "https://example.com",
                "method": "GET",
                "interval_seconds": 60,
                "timeout_seconds": 5,
            },
        )

    assert response.status_code == 201
    assert response.json()["name"] == "Example"


def test_get_monitor(
    api_app,
    monitor_service,
):
    monitor_service.get_one.return_value = (
        make_monitor()
    )

    with TestClient(api_app) as client:
        response = client.get(
            "/api/v1/monitors/1"
        )

    assert response.status_code == 200
    monitor_service.get_one.assert_awaited_once()


def test_update_monitor(
    api_app,
    monitor_service,
):
    monitor = make_monitor()
    monitor.enabled = False

    monitor_service.update.return_value = monitor

    with TestClient(api_app) as client:
        response = client.patch(
            "/api/v1/monitors/1",
            json={
                "enabled": False,
            },
        )

    assert response.status_code == 200
    assert response.json()["enabled"] is False


def test_delete_monitor_returns_204(
    api_app,
    monitor_service,
):
    monitor_service.delete.return_value = None

    with TestClient(api_app) as client:
        response = client.delete(
            "/api/v1/monitors/1"
        )

    assert response.status_code == 204
    assert response.content == b""


def test_manual_check(
    api_app,
    monitor_service,
):
    check = MonitorCheck(
        id=10,
        monitor_id=1,
        status=CheckStatus.SUCCESS,
        status_code=200,
        response_time_ms=25,
        error_type=None,
        error_message=None,
        checked_at=datetime.now(timezone.utc),
    )
    monitor_service.check_now.return_value = check

    with TestClient(api_app) as client:
        response = client.post(
            "/api/v1/monitors/1/check"
        )

    assert response.status_code == 200
    assert response.json()["status"] == "success"


def test_check_history_limit_validation(
    api_app,
    monitor_service,
):
    with TestClient(api_app) as client:
        response = client.get(
            "/api/v1/monitors/1/checks?limit=501"
        )

    assert response.status_code == 422
    monitor_service.get_checks.assert_not_awaited()


def test_incidents_endpoint(
    api_app,
    monitor_service,
):
    incident = Incident(
        id=1,
        monitor_id=1,
        status="open",
        cause="timeout",
        started_at=datetime.now(timezone.utc),
        resolved_at=None,
    )

    monitor_service.get_incidents.return_value = [
        incident
    ]

    with TestClient(api_app) as client:
        response = client.get(
            "/api/v1/monitors/1/incidents"
        )

    assert response.status_code == 200
    assert response.json()[0]["cause"] == "timeout"


def test_stats_endpoint(
    api_app,
    monitor_service,
):
    monitor_service.get_stats.return_value = {
        "period": "24h",
        "uptime_percentage": 99.5,
        "average_response_time_ms": 100.0,
        "min_response_time_ms": 50,
        "max_response_time_ms": 250,
        "total_checks": 200,
        "successful_checks": 199,
        "failed_checks": 1,
        "total_incidents": 1,
    }

    with TestClient(api_app) as client:
        response = client.get(
            "/api/v1/monitors/1/stats?period=24h"
        )

    assert response.status_code == 200
    assert response.json()[
        "uptime_percentage"
    ] == 99.5


def test_stats_rejects_unknown_period(
    api_app,
    monitor_service,
):
    with TestClient(api_app) as client:
        response = client.get(
            "/api/v1/monitors/1/stats?period=1h"
        )

    assert response.status_code == 422
    monitor_service.get_stats.assert_not_awaited()
