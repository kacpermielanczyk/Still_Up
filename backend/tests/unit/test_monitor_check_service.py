from datetime import datetime
from unittest.mock import AsyncMock

import pytest

from src.models.enums import (
    CheckStatus,
    IncidentStatus,
    MonitorStatus,
)
from src.models.incident import Incident
from src.services import monitor_check_service as module
from src.services.monitor_check_service import MonitorCheckService
from src.utils.http_checker import CheckResult
from tests.factories import make_monitor


@pytest.fixture
def db():
    value = AsyncMock()
    value.commit = AsyncMock()
    return value


@pytest.fixture
def checks():
    value = AsyncMock()
    value.create = AsyncMock()
    return value


@pytest.fixture
def incidents():
    value = AsyncMock()
    value.get_open = AsyncMock(
        return_value=None
    )
    value.create = AsyncMock()
    value.resolve = AsyncMock()
    return value


@pytest.mark.asyncio
async def test_success_updates_monitor_and_stores_check(
    db,
    checks,
    incidents,
    monkeypatch,
):
    monitor = make_monitor(
        status=MonitorStatus.UNKNOWN
    )
    stored_check = object()
    checks.create.return_value = stored_check

    monkeypatch.setattr(
        module,
        "check_http_resource",
        AsyncMock(
            return_value=CheckResult(
                status=CheckStatus.SUCCESS,
                status_code=200,
                response_time_ms=42,
            )
        ),
    )

    service = MonitorCheckService(
        db=db,
        checks=checks,
        incidents=incidents,
    )

    result = await service.run_check(
        monitor,
        reschedule=False,
    )

    assert result is stored_check
    assert monitor.status == MonitorStatus.UP
    assert monitor.last_status_code == 200
    assert monitor.last_response_time_ms == 42
    assert monitor.last_checked_at is not None
    checks.create.assert_awaited_once()
    incidents.create.assert_not_awaited()
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_failure_opens_incident_after_threshold(
    db,
    checks,
    incidents,
    monkeypatch,
):
    monitor = make_monitor(
        status=MonitorStatus.DEGRADED,
        consecutive_failures=1,
        failure_threshold=2,
    )

    checks.create.return_value = object()

    monkeypatch.setattr(
        module,
        "check_http_resource",
        AsyncMock(
            return_value=CheckResult(
                status=CheckStatus.FAILURE,
                status_code=503,
                response_time_ms=15,
                error_type="http_status",
                error_message="Unexpected HTTP status: 503",
            )
        ),
    )

    service = MonitorCheckService(
        db=db,
        checks=checks,
        incidents=incidents,
    )

    await service.run_check(
        monitor,
        reschedule=False,
    )

    assert monitor.status == MonitorStatus.DOWN
    assert monitor.consecutive_failures == 2
    incidents.create.assert_awaited_once_with(
        monitor_id=monitor.id,
        cause="http_status",
    )


@pytest.mark.asyncio
async def test_recovery_resolves_open_incident(
    db,
    checks,
    incidents,
    monkeypatch,
):
    monitor = make_monitor(
        status=MonitorStatus.DOWN,
        consecutive_failures=2,
        recovery_threshold=1,
    )

    open_incident = Incident(
        id=7,
        monitor_id=monitor.id,
        status=IncidentStatus.OPEN,
        cause="timeout",
    )
    incidents.get_open.return_value = (
        open_incident
    )
    checks.create.return_value = object()

    monkeypatch.setattr(
        module,
        "check_http_resource",
        AsyncMock(
            return_value=CheckResult(
                status=CheckStatus.SUCCESS,
                status_code=200,
                response_time_ms=31,
            )
        ),
    )

    service = MonitorCheckService(
        db=db,
        checks=checks,
        incidents=incidents,
    )

    await service.run_check(
        monitor,
        reschedule=False,
    )

    assert monitor.status == MonitorStatus.UP
    incidents.resolve.assert_awaited_once()

    args = incidents.resolve.await_args
    assert args.args[0] is open_incident
    assert isinstance(
        args.kwargs["resolved_at"],
        datetime,
    )


@pytest.mark.asyncio
async def test_worker_check_reschedules_monitor(
    db,
    checks,
    incidents,
    monkeypatch,
):
    monitor = make_monitor(
        interval_seconds=90
    )
    checks.create.return_value = object()

    monkeypatch.setattr(
        module,
        "check_http_resource",
        AsyncMock(
            return_value=CheckResult(
                status=CheckStatus.SUCCESS,
                status_code=200,
                response_time_ms=10,
            )
        ),
    )

    service = MonitorCheckService(
        db=db,
        checks=checks,
        incidents=incidents,
    )

    await service.run_check(
        monitor,
        reschedule=True,
    )

    assert monitor.next_check_at is not None
    assert monitor.last_checked_at is not None

    delta = (
        monitor.next_check_at
        - monitor.last_checked_at
    )

    assert 89 <= delta.total_seconds() <= 91
