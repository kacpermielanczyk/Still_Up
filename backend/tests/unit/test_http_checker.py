from unittest.mock import AsyncMock

import httpx
import pytest

from src.models.enums import CheckStatus
from src.utils import http_checker
from tests.factories import make_monitor


class FakeAsyncClient:
    def __init__(
        self,
        *,
        response=None,
        error=None,
        **kwargs,
    ):
        self.response = response
        self.error = error
        self.request = AsyncMock(
            side_effect=error,
            return_value=response,
        )

    async def __aenter__(self):
        return self

    async def __aexit__(
        self,
        exc_type,
        exc,
        tb,
    ):
        return False


@pytest.mark.asyncio
async def test_http_checker_marks_2xx_as_success(
    monkeypatch,
):
    response = httpx.Response(
        200,
        request=httpx.Request(
            "GET",
            "https://example.com",
        ),
    )

    monkeypatch.setattr(
        http_checker.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(
            response=response
        ),
    )

    result = await http_checker.check_http_resource(
        make_monitor()
    )

    assert result.status == CheckStatus.SUCCESS
    assert result.status_code == 200
    assert result.error_type is None
    assert result.response_time_ms is not None


@pytest.mark.asyncio
async def test_http_checker_honors_expected_status_code(
    monkeypatch,
):
    response = httpx.Response(
        201,
        request=httpx.Request(
            "GET",
            "https://example.com",
        ),
    )

    monkeypatch.setattr(
        http_checker.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(
            response=response
        ),
    )

    monitor = make_monitor(
        expected_status_code=204
    )

    result = await http_checker.check_http_resource(
        monitor
    )

    assert result.status == CheckStatus.FAILURE
    assert result.status_code == 201
    assert result.error_type == "http_status"


@pytest.mark.asyncio
async def test_http_checker_handles_timeout(
    monkeypatch,
):
    request = httpx.Request(
        "GET",
        "https://example.com",
    )
    error = httpx.ReadTimeout(
        "timed out",
        request=request,
    )

    monkeypatch.setattr(
        http_checker.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(
            error=error
        ),
    )

    result = await http_checker.check_http_resource(
        make_monitor()
    )

    assert result.status == CheckStatus.FAILURE
    assert result.status_code is None
    assert result.error_type == "timeout"


@pytest.mark.asyncio
async def test_http_checker_handles_connection_error(
    monkeypatch,
):
    request = httpx.Request(
        "GET",
        "https://example.com",
    )
    error = httpx.ConnectError(
        "connection refused",
        request=request,
    )

    monkeypatch.setattr(
        http_checker.httpx,
        "AsyncClient",
        lambda **kwargs: FakeAsyncClient(
            error=error
        ),
    )

    result = await http_checker.check_http_resource(
        make_monitor()
    )

    assert result.status == CheckStatus.FAILURE
    assert result.error_type == "connection_error"
