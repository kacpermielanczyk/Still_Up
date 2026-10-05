import asyncio
import logging
from datetime import datetime, timezone

from src.config.database import AsyncSessionLocal
from src.config.settings import settings
from src.repositories.incident_repository import IncidentRepository
from src.repositories.monitor_check_repository import MonitorCheckRepository
from src.repositories.monitor_repository import MonitorRepository
from src.services.monitor_check_service import MonitorCheckService


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger("still_up.worker")


async def process_monitor(
    monitor_id: int,
    semaphore: asyncio.Semaphore,
) -> None:
    async with semaphore:
        async with AsyncSessionLocal() as db:
            try:
                monitors = MonitorRepository(db)
                monitor = await monitors.get_by_id(monitor_id)

                if monitor is None or not monitor.enabled:
                    return

                service = MonitorCheckService(
                    db=db,
                    checks=MonitorCheckRepository(db),
                    incidents=IncidentRepository(db),
                )

                result = await service.run_check(
                    monitor,
                    reschedule=True,
                )

                logger.info(
                    "checked monitor=%s status=%s code=%s time=%sms",
                    monitor.id,
                    result.status.value,
                    result.status_code,
                    result.response_time_ms,
                )

            except Exception:
                await db.rollback()
                logger.exception(
                    "monitor check failed monitor=%s",
                    monitor_id,
                )


async def get_due_monitor_ids() -> list[int]:
    async with AsyncSessionLocal() as db:
        repository = MonitorRepository(db)

        return await repository.get_due_ids(
            now=datetime.now(timezone.utc),
            limit=settings.worker_batch_size,
        )


async def run_worker() -> None:
    logger.info(
        "worker started poll=%ss batch=%s concurrency=%s",
        settings.worker_poll_seconds,
        settings.worker_batch_size,
        settings.worker_concurrency,
    )

    semaphore = asyncio.Semaphore(
        settings.worker_concurrency
    )

    while True:
        try:
            monitor_ids = await get_due_monitor_ids()

            if monitor_ids:
                await asyncio.gather(
                    *[
                        process_monitor(
                            monitor_id,
                            semaphore,
                        )
                        for monitor_id in monitor_ids
                    ]
                )

        except Exception:
            logger.exception("worker loop failed")

        await asyncio.sleep(
            settings.worker_poll_seconds
        )


if __name__ == "__main__":
    asyncio.run(run_worker())
