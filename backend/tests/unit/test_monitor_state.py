import pytest

from src.models.enums import CheckStatus, MonitorStatus
from src.utils.monitor_state import calculate_monitor_state


@pytest.mark.parametrize(
    (
        "failures_before",
        "threshold",
        "expected_status",
        "expected_failures",
    ),
    [
        (0, 2, MonitorStatus.DEGRADED, 1),
        (1, 2, MonitorStatus.DOWN, 2),
        (2, 3, MonitorStatus.DOWN, 3),
    ],
)
def test_failure_threshold(
    failures_before,
    threshold,
    expected_status,
    expected_failures,
):
    state = calculate_monitor_state(
        current_status=MonitorStatus.UP,
        check_status=CheckStatus.FAILURE,
        failure_threshold=threshold,
        recovery_threshold=1,
        consecutive_failures=failures_before,
        consecutive_successes=0,
    )

    assert state.status == expected_status
    assert state.consecutive_failures == expected_failures
    assert state.consecutive_successes == 0


def test_success_resets_failure_counter():
    state = calculate_monitor_state(
        current_status=MonitorStatus.DEGRADED,
        check_status=CheckStatus.SUCCESS,
        failure_threshold=2,
        recovery_threshold=1,
        consecutive_failures=1,
        consecutive_successes=0,
    )

    assert state.status == MonitorStatus.UP
    assert state.consecutive_failures == 0
    assert state.consecutive_successes == 1


def test_recovery_can_require_multiple_successes():
    first = calculate_monitor_state(
        current_status=MonitorStatus.DOWN,
        check_status=CheckStatus.SUCCESS,
        failure_threshold=2,
        recovery_threshold=2,
        consecutive_failures=2,
        consecutive_successes=0,
    )

    assert first.status == MonitorStatus.DEGRADED
    assert first.consecutive_successes == 1

    second = calculate_monitor_state(
        current_status=first.status,
        check_status=CheckStatus.SUCCESS,
        failure_threshold=2,
        recovery_threshold=2,
        consecutive_failures=first.consecutive_failures,
        consecutive_successes=first.consecutive_successes,
    )

    assert second.status == MonitorStatus.UP
    assert second.consecutive_successes == 2


def test_failure_resets_success_counter():
    state = calculate_monitor_state(
        current_status=MonitorStatus.UP,
        check_status=CheckStatus.FAILURE,
        failure_threshold=3,
        recovery_threshold=2,
        consecutive_failures=0,
        consecutive_successes=4,
    )

    assert state.status == MonitorStatus.DEGRADED
    assert state.consecutive_successes == 0
