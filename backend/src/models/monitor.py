from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Index,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from src.config.database import Base
from src.models.enums import (
    HttpMethod,
    MonitorStatus,
    ResourceType,
)


if TYPE_CHECKING:
    from src.models.incident import Incident
    from src.models.monitor_check import MonitorCheck
    from src.models.user import User


class Monitor(Base):
    __tablename__ = "monitors"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    resource_type: Mapped[ResourceType] = mapped_column(
        SAEnum(
            ResourceType,
            native_enum=False,
            values_callable=lambda enum: [
                item.value for item in enum
            ],
        ),
        nullable=False,
    )

    url: Mapped[str] = mapped_column(
        String(2048),
        nullable=False,
    )

    method: Mapped[HttpMethod] = mapped_column(
        SAEnum(
            HttpMethod,
            native_enum=False,
            values_callable=lambda enum: [
                item.value for item in enum
            ],
        ),
        default=HttpMethod.GET,
        nullable=False,
    )

    interval_seconds: Mapped[int] = mapped_column(
        Integer,
        default=60,
        nullable=False,
    )

    timeout_seconds: Mapped[int] = mapped_column(
        Integer,
        default=5,
        nullable=False,
    )

    expected_status_code: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    follow_redirects: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    status: Mapped[MonitorStatus] = mapped_column(
        SAEnum(
            MonitorStatus,
            native_enum=False,
            values_callable=lambda enum: [
                item.value for item in enum
            ],
        ),
        default=MonitorStatus.UNKNOWN,
        nullable=False,
    )

    failure_threshold: Mapped[int] = mapped_column(
        Integer,
        default=2,
        nullable=False,
    )

    recovery_threshold: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    consecutive_failures: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    consecutive_successes: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    last_status_code: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    last_response_time_ms: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    last_checked_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    next_check_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="monitors",
    )

    checks: Mapped[list["MonitorCheck"]] = relationship(
        back_populates="monitor",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    incidents: Mapped[list["Incident"]] = relationship(
        back_populates="monitor",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    __table_args__ = (
        Index(
            "ix_monitors_enabled_next_check_at",
            "enabled",
            "next_check_at",
        ),
    )