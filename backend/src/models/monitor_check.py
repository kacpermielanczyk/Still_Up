from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
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
from src.models.enums import CheckStatus


if TYPE_CHECKING:
    from src.models.monitor import Monitor


class MonitorCheck(Base):
    __tablename__ = "monitor_checks"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    monitor_id: Mapped[int] = mapped_column(
        ForeignKey(
            "monitors.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    status: Mapped[CheckStatus] = mapped_column(
        SAEnum(
            CheckStatus,
            native_enum=False,
            values_callable=lambda enum: [
                item.value for item in enum
            ],
        ),
        nullable=False,
    )

    status_code: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    response_time_ms: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    error_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    error_message: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )

    checked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    monitor: Mapped["Monitor"] = relationship(
        back_populates="checks",
    )

    __table_args__ = (
        Index(
            "ix_monitor_checks_monitor_checked_at",
            "monitor_id",
            "checked_at",
        ),
    )