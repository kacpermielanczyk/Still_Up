from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.enums import CheckStatus
from src.models.monitor_check import MonitorCheck


class MonitorCheckRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        monitor_id: int,
        *,
        status: CheckStatus,
        status_code: int | None,
        response_time_ms: int | None,
        error_type: str | None,
        error_message: str | None,
    ) -> MonitorCheck:
        check = MonitorCheck(
            monitor_id=monitor_id,
            status=status,
            status_code=status_code,
            response_time_ms=response_time_ms,
            error_type=error_type,
            error_message=error_message,
        )

        self.db.add(check)

        await self.db.flush()
        await self.db.refresh(check)

        return check

    async def get_all(
        self,
        monitor_id: int,
        limit: int = 50,
    ) -> list[MonitorCheck]:
        result = await self.db.execute(
            select(MonitorCheck)
            .where(
                MonitorCheck.monitor_id
                == monitor_id
            )
            .order_by(
                MonitorCheck.checked_at.desc()
            )
            .limit(limit)
        )

        return list(
            result.scalars().all()
        )

    async def get_stats(
        self,
        monitor_id: int,
        since: datetime,
    ):
        result = await self.db.execute(
            select(
                func.count(
                    MonitorCheck.id
                ),
                func.count(
                    MonitorCheck.id
                ).filter(
                    MonitorCheck.status
                    == CheckStatus.SUCCESS
                ),
                func.avg(
                    MonitorCheck.response_time_ms
                ),
                func.min(
                    MonitorCheck.response_time_ms
                ),
                func.max(
                    MonitorCheck.response_time_ms
                ),
            ).where(
                MonitorCheck.monitor_id
                == monitor_id,
                MonitorCheck.checked_at
                >= since,
            )
        )

        return result.one()
