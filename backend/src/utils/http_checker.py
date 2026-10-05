from dataclasses import dataclass
import time

import httpx

from src.models.enums import CheckStatus
from src.models.monitor import Monitor


@dataclass(slots=True)
class CheckResult:
    status: CheckStatus
    status_code: int | None
    response_time_ms: int | None

    error_type: str | None = None
    error_message: str | None = None


async def check_http_resource(
    monitor: Monitor,
) -> CheckResult:
    start = time.perf_counter()

    try:
        async with httpx.AsyncClient(
            follow_redirects=monitor.follow_redirects
        ) as client:
            response = await client.request(
                method=monitor.method.value,
                url=monitor.url,
                timeout=monitor.timeout_seconds,
            )

        elapsed = int(
            (time.perf_counter() - start) * 1000
        )

        if monitor.expected_status_code is not None:
            success = (
                response.status_code
                == monitor.expected_status_code
            )
        else:
            success = (
                200 <= response.status_code < 400
            )

        if success:
            return CheckResult(
                status=CheckStatus.SUCCESS,
                status_code=response.status_code,
                response_time_ms=elapsed,
            )

        return CheckResult(
            status=CheckStatus.FAILURE,
            status_code=response.status_code,
            response_time_ms=elapsed,
            error_type="http_status",
            error_message=(
                f"Unexpected HTTP status: "
                f"{response.status_code}"
            ),
        )

    except httpx.TimeoutException as error:
        elapsed = int(
            (time.perf_counter() - start) * 1000
        )

        return CheckResult(
            status=CheckStatus.FAILURE,
            status_code=None,
            response_time_ms=elapsed,
            error_type="timeout",
            error_message=str(error),
        )

    except httpx.ConnectError as error:
        elapsed = int(
            (time.perf_counter() - start) * 1000
        )

        return CheckResult(
            status=CheckStatus.FAILURE,
            status_code=None,
            response_time_ms=elapsed,
            error_type="connection_error",
            error_message=str(error),
        )

    except httpx.RequestError as error:
        elapsed = int(
            (time.perf_counter() - start) * 1000
        )

        return CheckResult(
            status=CheckStatus.FAILURE,
            status_code=None,
            response_time_ms=elapsed,
            error_type="request_error",
            error_message=str(error),
        )
