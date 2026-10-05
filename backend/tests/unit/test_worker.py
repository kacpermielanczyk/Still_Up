import asyncio
from unittest.mock import AsyncMock

import pytest

from src.workers import main as worker


class FakeSessionContext:
    def __init__(
        self,
        session,
    ):
        self.session = session

    async def __aenter__(self):
        return self.session

    async def __aexit__(
        self,
        exc_type,
        exc,
        tb,
    ):
        return False


@pytest.mark.asyncio
async def test_get_due_monitor_ids_uses_worker_batch_size(
    monkeypatch,
):
    db = AsyncMock()

    repository = AsyncMock()
    repository.get_due_ids.return_value = [
        1,
        2,
    ]

    monkeypatch.setattr(
        worker,
        "AsyncSessionLocal",
        lambda: FakeSessionContext(db),
    )
    monkeypatch.setattr(
        worker,
        "MonitorRepository",
        lambda session: repository,
    )

    ids = await worker.get_due_monitor_ids()

    assert ids == [1, 2]

    kwargs = (
        repository.get_due_ids.await_args.kwargs
    )

    assert kwargs["limit"] == (
        worker.settings.worker_batch_size
    )
    assert kwargs["now"] is not None


@pytest.mark.asyncio
async def test_process_monitor_skips_disabled_monitor(
    monkeypatch,
):
    db = AsyncMock()

    repository = AsyncMock()
    monitor = AsyncMock()
    monitor.enabled = False
    repository.get_by_id.return_value = monitor

    monkeypatch.setattr(
        worker,
        "AsyncSessionLocal",
        lambda: FakeSessionContext(db),
    )
    monkeypatch.setattr(
        worker,
        "MonitorRepository",
        lambda session: repository,
    )

    check_service = AsyncMock()

    monkeypatch.setattr(
        worker,
        "MonitorCheckService",
        lambda **kwargs: check_service,
    )

    await worker.process_monitor(
        1,
        asyncio.Semaphore(1),
    )

    check_service.run_check.assert_not_awaited()


@pytest.mark.asyncio
async def test_process_monitor_runs_check_with_reschedule(
    monkeypatch,
):
    db = AsyncMock()

    repository = AsyncMock()

    monitor = AsyncMock()
    monitor.id = 7
    monitor.enabled = True

    repository.get_by_id.return_value = monitor

    monkeypatch.setattr(
        worker,
        "AsyncSessionLocal",
        lambda: FakeSessionContext(db),
    )
    monkeypatch.setattr(
        worker,
        "MonitorRepository",
        lambda session: repository,
    )

    result = AsyncMock()
    result.status.value = "success"
    result.status_code = 200
    result.response_time_ms = 30

    check_service = AsyncMock()
    check_service.run_check.return_value = result

    monkeypatch.setattr(
        worker,
        "MonitorCheckService",
        lambda **kwargs: check_service,
    )

    await worker.process_monitor(
        7,
        asyncio.Semaphore(1),
    )

    check_service.run_check.assert_awaited_once_with(
        monitor,
        reschedule=True,
    )


@pytest.mark.asyncio
async def test_process_monitor_rolls_back_on_error(
    monkeypatch,
):
    db = AsyncMock()
    db.rollback = AsyncMock()

    repository = AsyncMock()
    monitor = AsyncMock()
    monitor.enabled = True
    repository.get_by_id.return_value = monitor

    monkeypatch.setattr(
        worker,
        "AsyncSessionLocal",
        lambda: FakeSessionContext(db),
    )
    monkeypatch.setattr(
        worker,
        "MonitorRepository",
        lambda session: repository,
    )

    check_service = AsyncMock()
    check_service.run_check.side_effect = (
        RuntimeError("boom")
    )

    monkeypatch.setattr(
        worker,
        "MonitorCheckService",
        lambda **kwargs: check_service,
    )

    await worker.process_monitor(
        1,
        asyncio.Semaphore(1),
    )

    db.rollback.assert_awaited_once()
