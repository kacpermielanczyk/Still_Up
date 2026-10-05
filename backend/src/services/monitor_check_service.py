from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from src.models.enums import MonitorStatus
from src.models.monitor import Monitor
from src.repositories.incident_repository import IncidentRepository
from src.repositories.monitor_check_repository import MonitorCheckRepository
from src.utils.http_checker import check_http_resource
from src.utils.monitor_state import calculate_monitor_state


class MonitorCheckService:
    def __init__(
        self,
        db: AsyncSession,
        checks: MonitorCheckRepository,
        incidents: IncidentRepository,
    ):
        self.db = db
        self.checks = checks
        self.incidents = incidents

    async def run_check(
        self,
        monitor: Monitor,
        *,
        reschedule: bool,
    ):
        result = await check_http_resource(monitor)
        now = datetime.now(timezone.utc)

        state = calculate_monitor_state(
            current_status=monitor.status,
            check_status=result.status,
            failure_threshold=monitor.failure_threshold,
            recovery_threshold=monitor.recovery_threshold,
            consecutive_failures=monitor.consecutive_failures,
            consecutive_successes=monitor.consecutive_successes,
        )

        monitor.status = state.status
        monitor.consecutive_failures = state.consecutive_failures
        monitor.consecutive_successes = state.consecutive_successes

        monitor.last_status_code = result.status_code
        monitor.last_response_time_ms = result.response_time_ms
        monitor.last_checked_at = now

        if reschedule:
            monitor.next_check_at = now + timedelta(
                seconds=monitor.interval_seconds
            )

        check = await self.checks.create(
            monitor_id=monitor.id,
            status=result.status,
            status_code=result.status_code,
            response_time_ms=result.response_time_ms,
            error_type=result.error_type,
            error_message=result.error_message,
        )

        open_incident = await self.incidents.get_open(monitor.id)

        if (
            monitor.status == MonitorStatus.DOWN
            and open_incident is None
        ):
            cause = (
                result.error_type
                or (
                    f"HTTP {result.status_code}"
                    if result.status_code is not None
                    else "Unknown error"
                )
            )

            await self.incidents.create(
                monitor_id=monitor.id,
                cause=cause,
            )

        if (
            monitor.status == MonitorStatus.UP
            and open_incident is not None
        ):
            await self.incidents.resolve(
                open_incident,
                resolved_at=now,
            )

        await self.db.commit()
        return check
