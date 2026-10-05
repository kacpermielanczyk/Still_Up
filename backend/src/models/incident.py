from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Index,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.config.database import Base
from src.models.enums import IncidentStatus


if TYPE_CHECKING:
    from src.models.monitor import Monitor


class Incident(Base):
    __tablename__ = "incidents"

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

    status: Mapped[IncidentStatus] = mapped_column(
        SAEnum(
            IncidentStatus,
            native_enum=False,
            values_callable=lambda enum: [
                item.value for item in enum
            ],
        ),
        default=IncidentStatus.OPEN,
        nullable=False,
    )

    cause: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    monitor: Mapped["Monitor"] = relationship(
        back_populates="incidents",
    )

    __table_args__ = (
        Index(
            "ix_incidents_monitor_started_at",
            "monitor_id",
            "started_at",
        ),
    )
