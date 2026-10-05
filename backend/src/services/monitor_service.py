from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user import User
from src.repositories.incident_repository import IncidentRepository
from src.repositories.monitor_check_repository import MonitorCheckRepository
from src.repositories.monitor_repository import MonitorRepository
from src.schemas.monitor import MonitorCreateRequest, MonitorUpdateRequest
from src.services.monitor_check_service import MonitorCheckService


class MonitorService:
    def __init__(
        self,
        db: AsyncSession,
        monitors: MonitorRepository,
        checks: MonitorCheckRepository,
        incidents: IncidentRepository,
        check_service: MonitorCheckService,
    ):
        self.db = db
        self.monitors = monitors
        self.checks = checks
        self.incidents = incidents
        self.check_service = check_service

    async def get_all(
        self,
        user: User,
    ):
        return await self.monitors.get_all_by_user(
            user.id
        )

    async def get_one(
        self,
        monitor_id: int,
        user: User,
    ):
        monitor = await self.monitors.get_by_id_for_user(
            monitor_id,
            user.id,
        )

        if monitor is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Monitor not found",
            )

        return monitor

    async def create(
        self,
        data: MonitorCreateRequest,
        user: User,
    ):
        payload = data.model_dump()
        payload["url"] = str(payload["url"])
        payload["next_check_at"] = datetime.now(
            timezone.utc
        )

        monitor = await self.monitors.create(
            user_id=user.id,
            data=payload,
        )

        await self.db.commit()
        return monitor

    async def update(
        self,
        monitor_id: int,
        data: MonitorUpdateRequest,
        user: User,
    ):
        monitor = await self.get_one(
            monitor_id,
            user,
        )

        payload = data.model_dump(
            exclude_unset=True
        )

        if (
            "url" in payload
            and payload["url"] is not None
        ):
            payload["url"] = str(
                payload["url"]
            )

        if (
            "interval_seconds" in payload
            and payload["interval_seconds"] is not None
        ):
            payload["next_check_at"] = (
                datetime.now(timezone.utc)
                + timedelta(
                    seconds=payload["interval_seconds"]
                )
            )

        monitor = await self.monitors.update(
            monitor,
            payload,
        )

        await self.db.commit()
        return monitor

    async def delete(
        self,
        monitor_id: int,
        user: User,
    ) -> None:
        monitor = await self.get_one(
            monitor_id,
            user,
        )

        await self.monitors.delete(monitor)
        await self.db.commit()

    async def check_now(
        self,
        monitor_id: int,
        user: User,
    ):
        monitor = await self.get_one(
            monitor_id,
            user,
        )

        return await self.check_service.run_check(
            monitor,
            reschedule=False,
        )

    async def get_checks(
        self,
        monitor_id: int,
        user: User,
        limit: int,
    ):
        monitor = await self.get_one(
            monitor_id,
            user,
        )

        return await self.checks.get_all(
            monitor.id,
            limit=limit,
        )

    async def get_incidents(
        self,
        monitor_id: int,
        user: User,
        limit: int,
    ):
        monitor = await self.get_one(
            monitor_id,
            user,
        )

        return await self.incidents.get_all(
            monitor.id,
            limit=limit,
        )

    async def get_stats(
        self,
        monitor_id: int,
        user: User,
        period: str,
    ):
        monitor = await self.get_one(
            monitor_id,
            user,
        )

        now = datetime.now(timezone.utc)

        period_map = {
            "24h": timedelta(hours=24),
            "7d": timedelta(days=7),
            "30d": timedelta(days=30),
        }

        delta = period_map.get(period)

        if delta is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid period",
            )

        since = now - delta

        (
            total,
            successful,
            average,
            minimum,
            maximum,
        ) = await self.checks.get_stats(
            monitor.id,
            since,
        )

        total = total or 0
        successful = successful or 0
        failed = total - successful

        uptime = (
            successful / total * 100
            if total > 0
            else 0.0
        )

        incidents = await self.incidents.count_since(
            monitor.id,
            since,
        )

        return {
            "period": period,
            "uptime_percentage": round(uptime, 2),
            "average_response_time_ms": (
                round(float(average), 2)
                if average is not None
                else None
            ),
            "min_response_time_ms": minimum,
            "max_response_time_ms": maximum,
            "total_checks": total,
            "successful_checks": successful,
            "failed_checks": failed,
            "total_incidents": incidents,
        }
