from datetime import datetime

from pydantic import BaseModel, ConfigDict

from src.models.enums import CheckStatus


class MonitorCheckResponse(BaseModel):
    id: int

    status: CheckStatus

    status_code: int | None
    response_time_ms: int | None

    error_type: str | None
    error_message: str | None

    checked_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
