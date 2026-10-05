import os

import pytest
from sqlalchemy import inspect
from sqlalchemy.ext.asyncio import create_async_engine

import src.models  # noqa: F401
from src.config.database import Base


TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL"
)


@pytest.mark.asyncio
@pytest.mark.skipif(
    not TEST_DATABASE_URL,
    reason=(
        "Set TEST_DATABASE_URL to run "
        "the real PostgreSQL smoke test"
    ),
)
async def test_models_create_on_real_postgresql():
    """
    Smoke test model compatibility with PostgreSQL
    """
    engine = create_async_engine(
        TEST_DATABASE_URL
    )

    try:
        async with engine.begin() as connection:
            await connection.run_sync(
                Base.metadata.drop_all
            )
            await connection.run_sync(
                Base.metadata.create_all
            )

            def get_table_names(
                sync_connection,
            ):
                return set(
                    inspect(
                        sync_connection
                    ).get_table_names()
                )

            tables = await connection.run_sync(
                get_table_names
            )

        assert {
            "users",
            "monitors",
            "monitor_checks",
            "incidents",
        }.issubset(tables)

    finally:
        async with engine.begin() as connection:
            await connection.run_sync(
                Base.metadata.drop_all
            )

        await engine.dispose()
