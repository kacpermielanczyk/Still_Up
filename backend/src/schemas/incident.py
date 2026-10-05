from datetime import datetime

from pydantic import BaseModel, ConfigDict

from src.models.enums import IncidentStatus


class IncidentResponse(BaseModel):
    id: int

    status: IncidentStatus
    cause: str | None

    started_at: datetime
    resolved_at: datetime | None

    model_config = ConfigDict(
        from_attributes=True
    )
