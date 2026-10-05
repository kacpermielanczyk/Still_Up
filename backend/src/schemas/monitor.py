from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from src.models.enums import (
    HttpMethod,
    MonitorStatus,
    ResourceType,
)


class MonitorCreateRequest(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100,
    )

    resource_type: ResourceType
    url: HttpUrl

    method: HttpMethod = HttpMethod.GET

    interval_seconds: int = Field(
        default=60,
        ge=10,
        le=3600,
    )

    timeout_seconds: int = Field(
        default=5,
        ge=1,
        le=30,
    )

    expected_status_code: int | None = Field(
        default=None,
        ge=100,
        le=599,
    )

    follow_redirects: bool = True

    failure_threshold: int = Field(
        default=2,
        ge=1,
        le=10,
    )

    recovery_threshold: int = Field(
        default=1,
        ge=1,
        le=10,
    )


class MonitorUpdateRequest(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    resource_type: ResourceType | None = None
    url: HttpUrl | None = None
    method: HttpMethod | None = None

    interval_seconds: int | None = Field(
        default=None,
        ge=10,
        le=3600,
    )

    timeout_seconds: int | None = Field(
        default=None,
        ge=1,
        le=30,
    )

    expected_status_code: int | None = Field(
        default=None,
        ge=100,
        le=599,
    )

    follow_redirects: bool | None = None
    enabled: bool | None = None

    failure_threshold: int | None = Field(
        default=None,
        ge=1,
        le=10,
    )

    recovery_threshold: int | None = Field(
        default=None,
        ge=1,
        le=10,
    )


class MonitorResponse(BaseModel):
    id: int

    name: str
    resource_type: ResourceType

    url: str
    method: HttpMethod

    interval_seconds: int
    timeout_seconds: int

    expected_status_code: int | None
    follow_redirects: bool

    enabled: bool
    status: MonitorStatus

    failure_threshold: int
    recovery_threshold: int

    consecutive_failures: int
    consecutive_successes: int

    last_status_code: int | None
    last_response_time_ms: int | None

    last_checked_at: datetime | None
    next_check_at: datetime | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
