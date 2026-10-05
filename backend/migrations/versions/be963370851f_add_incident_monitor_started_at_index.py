"""add incident monitor started at index

Revision ID: be963370851f
Revises: 9d084352e142
Create Date: 2026-10-06 00:37:31.571466

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "be963370851f"
down_revision: Union[str, Sequence[str], None] = "9d084352e142"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_incidents_monitor_started_at",
        "incidents",
        ["monitor_id", "started_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_incidents_monitor_started_at",
        table_name="incidents",
    )