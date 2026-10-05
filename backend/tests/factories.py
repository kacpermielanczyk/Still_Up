from datetime import datetime, timezone

from src.models.enums import (
    HttpMethod,
    MonitorStatus,
    ResourceType,
)
from src.models.monitor import Monitor
from src.models.user import User


def make_user(
    *,
    user_id: int = 1,
    email: str = "user@example.com",
    is_active: bool = True,
) -> User:
    return User(
        id=user_id,
        email=email,
        password_hash="hashed-password",
        is_active=is_active,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )


def make_monitor(
    *,
    monitor_id: int = 1,
    user_id: int = 1,
    status: MonitorStatus = MonitorStatus.UNKNOWN,
    enabled: bool = True,
    interval_seconds: int = 60,
    timeout_seconds: int = 5,
    failure_threshold: int = 2,
    recovery_threshold: int = 1,
    consecutive_failures: int = 0,
    consecutive_successes: int = 0,
    expected_status_code: int | None = None,
) -> Monitor:
    return Monitor(
        id=monitor_id,
        user_id=user_id,
        name="Example",
        resource_type=ResourceType.WEBSITE,
        url="https://example.com/",
        method=HttpMethod.GET,
        interval_seconds=interval_seconds,
        timeout_seconds=timeout_seconds,
        expected_status_code=expected_status_code,
        follow_redirects=True,
        enabled=enabled,
        status=status,
        failure_threshold=failure_threshold,
        recovery_threshold=recovery_threshold,
        consecutive_failures=consecutive_failures,
        consecutive_successes=consecutive_successes,
        last_status_code=None,
        last_response_time_ms=None,
        last_checked_at=None,
        next_check_at=None,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
