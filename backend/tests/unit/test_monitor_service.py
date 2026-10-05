from datetime import datetime
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException

from src.models.enums import ResourceType
from src.schemas.monitor import (
    MonitorCreateRequest,
    MonitorUpdateRequest,
)
from src.services.monitor_service import MonitorService
from tests.factories import make_monitor, make_user


@pytest.fixture
def dependencies():
    db = AsyncMock()
    db.commit = AsyncMock()

    monitors = AsyncMock()
    checks = AsyncMock()
    incidents = AsyncMock()
    check_service = AsyncMock()

    service = MonitorService(
        db=db,
        monitors=monitors,
        checks=checks,
        incidents=incidents,
        check_service=check_service,
    )

    return (
        service,
        db,
        monitors,
        checks,
        incidents,
        check_service,
    )


@pytest.mark.asyncio
async def test_get_one_hides_foreign_or_missing_monitor(
    dependencies,
):
    service, _, monitors, *_ = dependencies
    monitors.get_by_id_for_user.return_value = None

    with pytest.raises(
        HTTPException
    ) as error:
        await service.get_one(
            99,
            make_user(),
        )

    assert error.value.status_code == 404


@pytest.mark.asyncio
async def test_create_assigns_user_and_schedules_first_check(
    dependencies,
):
    (
        service,
        db,
        monitors,
        *_,
    ) = dependencies

    created = make_monitor()
    monitors.create.return_value = created

    user = make_user()

    result = await service.create(
        MonitorCreateRequest(
            name="Site",
            resource_type=ResourceType.WEBSITE,
            url="https://example.com",
            interval_seconds=60,
            timeout_seconds=5,
        ),
        user,
    )

    assert result is created
    monitors.create.assert_awaited_once()

    kwargs = monitors.create.await_args.kwargs
    assert kwargs["user_id"] == user.id
    assert kwargs["data"]["url"] == "https://example.com/"
    assert isinstance(
        kwargs["data"]["next_check_at"],
        datetime,
    )
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_interval_reschedules_monitor(
    dependencies,
):
    (
        service,
        db,
        monitors,
        *_,
    ) = dependencies

    monitor = make_monitor()
    monitors.get_by_id_for_user.return_value = monitor
    monitors.update.return_value = monitor

    await service.update(
        monitor.id,
        MonitorUpdateRequest(
            interval_seconds=120
        ),
        make_user(),
    )

    payload = (
        monitors.update.await_args.args[1]
    )

    assert payload["interval_seconds"] == 120
    assert isinstance(
        payload["next_check_at"],
        datetime,
    )
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_manual_check_uses_shared_check_service(
    dependencies,
):
    (
        service,
        _,
        monitors,
        _,
        _,
        check_service,
    ) = dependencies

    monitor = make_monitor()
    monitors.get_by_id_for_user.return_value = monitor
    expected = object()

    check_service.run_check.return_value = expected

    result = await service.check_now(
        monitor.id,
        make_user(),
    )

    assert result is expected
    check_service.run_check.assert_awaited_once_with(
        monitor,
        reschedule=False,
    )


@pytest.mark.asyncio
async def test_stats_are_calculated_correctly(
    dependencies,
):
    (
        service,
        _,
        monitors,
        checks,
        incidents,
        _,
    ) = dependencies

    monitor = make_monitor()
    monitors.get_by_id_for_user.return_value = monitor

    checks.get_stats.return_value = (
        100,
        98,
        120.456,
        50,
        500,
    )
    incidents.count_since.return_value = 2

    stats = await service.get_stats(
        monitor.id,
        make_user(),
        "24h",
    )

    assert stats == {
        "period": "24h",
        "uptime_percentage": 98.0,
        "average_response_time_ms": 120.46,
        "min_response_time_ms": 50,
        "max_response_time_ms": 500,
        "total_checks": 100,
        "successful_checks": 98,
        "failed_checks": 2,
        "total_incidents": 2,
    }


@pytest.mark.asyncio
async def test_stats_reject_invalid_period(
    dependencies,
):
    service, _, monitors, *_ = dependencies

    monitors.get_by_id_for_user.return_value = (
        make_monitor()
    )

    with pytest.raises(
        HTTPException
    ) as error:
        await service.get_stats(
            1,
            make_user(),
            "1h",
        )

    assert error.value.status_code == 400
