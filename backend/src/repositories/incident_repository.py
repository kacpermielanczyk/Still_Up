from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.enums import IncidentStatus
from src.models.incident import Incident


class IncidentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_open(
        self,
        monitor_id: int,
    ) -> Incident | None:
        result = await self.db.execute(
            select(Incident).where(
                Incident.monitor_id == monitor_id,
                Incident.status == IncidentStatus.OPEN,
            )
        )

        return result.scalar_one_or_none()

    async def create(
        self,
        monitor_id: int,
        cause: str | None,
    ) -> Incident:
        incident = Incident(
            monitor_id=monitor_id,
            status=IncidentStatus.OPEN,
            cause=cause,
        )

        self.db.add(incident)

        await self.db.flush()
        await self.db.refresh(incident)

        return incident

    async def resolve(
        self,
        incident: Incident,
        resolved_at: datetime,
    ) -> Incident:
        incident.status = IncidentStatus.RESOLVED
        incident.resolved_at = resolved_at

        await self.db.flush()
        await self.db.refresh(incident)

        return incident

    async def get_all(
        self,
        monitor_id: int,
        limit: int = 20,
    ) -> list[Incident]:
        result = await self.db.execute(
            select(Incident)
            .where(
                Incident.monitor_id == monitor_id
            )
            .order_by(
                Incident.started_at.desc()
            )
            .limit(limit)
        )

        return list(
            result.scalars().all()
        )

    async def count_since(
        self,
        monitor_id: int,
        since: datetime,
    ) -> int:
        result = await self.db.execute(
            select(
                func.count(Incident.id)
            ).where(
                Incident.monitor_id == monitor_id,
                Incident.started_at >= since,
            )
        )

        return result.scalar_one()
