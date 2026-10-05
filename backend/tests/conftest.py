import os
from collections.abc import AsyncGenerator

# Settings są tworzone przy imporcie modułów aplikacji.
# Te wartości muszą więc istnieć jeszcze przed importem `src.*`.
os.environ.setdefault(
    "JWT_SECRET",
    "test-secret-key-that-is-definitely-longer-than-32-bytes",
)
os.environ.setdefault("DEBUG", "false")
os.environ.setdefault("AUTO_MIGRATE", "false")

import pytest_asyncio
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

import src.models  # noqa: F401
from src.config.database import Base


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Lekka baza SQLite tylko do testów repositories/models.

    Nie zastępuje testu zgodności z PostgreSQL, ale pozwala uruchamiać
    suite bez lokalnego Postgresa i bez Dockera.
    """
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
    )

    async with engine.begin() as connection:
        await connection.run_sync(
            Base.metadata.create_all
        )

    session_factory = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with session_factory() as session:
        yield session
        await session.rollback()

    await engine.dispose()
