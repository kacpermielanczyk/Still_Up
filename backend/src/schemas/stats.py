from pydantic import BaseModel


class MonitorStatsResponse(BaseModel):
    period: str

    uptime_percentage: float

    average_response_time_ms: float | None
    min_response_time_ms: int | None
    max_response_time_ms: int | None

    total_checks: int
    successful_checks: int
    failed_checks: int

    total_incidents: int
