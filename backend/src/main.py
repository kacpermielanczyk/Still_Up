import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.router import api_router
from src.config.database import (
    check_database_connection,
    close_database_connection,
)
from src.config.migrations import run_migrations
from src.config.settings import settings


@asynccontextmanager
async def lifespan(
    app: FastAPI,
):
    if settings.auto_migrate:
        await asyncio.to_thread(
            run_migrations
        )

    await check_database_connection()

    yield

    await close_database_connection()


app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    debug=settings.debug,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    api_router,
    prefix=settings.api_prefix,
)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": f"{settings.app_name} is running",
    }
