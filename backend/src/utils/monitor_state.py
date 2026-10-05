from dataclasses import dataclass

from src.models.enums import CheckStatus, MonitorStatus


@dataclass(slots=True)
class MonitorStateUpdate:
    status: MonitorStatus
    consecutive_failures: int
    consecutive_successes: int


def calculate_monitor_state(
    *,
    current_status: MonitorStatus,
    check_status: CheckStatus,
    failure_threshold: int,
    recovery_threshold: int,
    consecutive_failures: int,
    consecutive_successes: int,
) -> MonitorStateUpdate:
    if check_status == CheckStatus.SUCCESS:
        consecutive_failures = 0
        consecutive_successes += 1

        if consecutive_successes >= recovery_threshold:
            new_status = MonitorStatus.UP
        elif current_status == MonitorStatus.DOWN:
            new_status = MonitorStatus.DEGRADED
        else:
            new_status = current_status

        return MonitorStateUpdate(
            status=new_status,
            consecutive_failures=consecutive_failures,
            consecutive_successes=consecutive_successes,
        )

    consecutive_successes = 0
    consecutive_failures += 1

    new_status = (
        MonitorStatus.DOWN
        if consecutive_failures >= failure_threshold
        else MonitorStatus.DEGRADED
    )

    return MonitorStateUpdate(
        status=new_status,
        consecutive_failures=consecutive_failures,
        consecutive_successes=consecutive_successes,
    )
