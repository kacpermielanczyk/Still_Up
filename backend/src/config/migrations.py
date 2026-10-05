from pathlib import Path

from alembic import command
from alembic.config import Config


BASE_DIR = Path(__file__).resolve().parents[2]


def run_migrations() -> None:
    alembic_config = Config(
        str(BASE_DIR / "alembic.ini")
    )

    alembic_config.set_main_option(
        "script_location",
        str(BASE_DIR / "migrations"),
    )

    command.upgrade(
        alembic_config,
        "head",
    )
