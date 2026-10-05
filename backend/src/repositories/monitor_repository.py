from datetime import datetime

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.monitor import Monitor


class MonitorRepository:
    def __init__(
        self,
        db: AsyncSession,
    ):
        self.db = db

    async def get_all_by_user(
        self,
        user_id: int,
    ) -> list[Monitor]:
        result = await self.db.execute(
            select(Monitor)
            .where(
                Monitor.user_id == user_id
            )
            .order_by(
                Monitor.created_at.desc()
            )
        )

        return list(
            result.scalars().all()
        )

    async def get_by_id(
        self,
        monitor_id: int,
    ) -> Monitor | None:
        result = await self.db.execute(
            select(Monitor).where(
                Monitor.id == monitor_id
            )
        )

        return result.scalar_one_or_none()

    async def get_by_id_for_user(
        self,
        monitor_id: int,
        user_id: int,
    ) -> Monitor | None:
        result = await self.db.execute(
            select(Monitor).where(
                Monitor.id == monitor_id,
                Monitor.user_id == user_id,
            )
        )

        return result.scalar_one_or_none()

    async def get_due_ids(
        self,
        *,
        now: datetime,
        limit: int,
    ) -> list[int]:
        result = await self.db.execute(
            select(Monitor.id)
            .where(
                Monitor.enabled.is_(True),
                or_(
                    Monitor.next_check_at.is_(None),
                    Monitor.next_check_at <= now,
                ),
            )
            .order_by(
                Monitor.next_check_at.asc().nullsfirst()
            )
            .limit(limit)
        )

        return list(
            result.scalars().all()
        )

    async def create(
        self,
        user_id: int,
        data: dict,
    ) -> Monitor:
        monitor = Monitor(
            user_id=user_id,
            **data,
        )

        self.db.add(monitor)

        await self.db.flush()
        await self.db.refresh(monitor)

        return monitor

    async def update(
        self,
        monitor: Monitor,
        data: dict,
    ) -> Monitor:
        for key, value in data.items():
            setattr(monitor, key, value)

        await self.db.flush()
        await self.db.refresh(monitor)

        return monitor

    async def delete(
        self,
        monitor: Monitor,
    ) -> None:
        await self.db.delete(monitor)
