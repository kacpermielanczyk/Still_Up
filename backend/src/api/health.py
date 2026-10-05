from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.config.database import get_db


router = APIRouter(
    prefix="/health",
    tags=["health"],
)


@router.get("")
async def health(
    db: AsyncSession = Depends(get_db),
):
    try:
        await db.execute(text("SELECT 1"))

        migration_result = await db.execute(
            text(
                """
                SELECT version_num
                FROM alembic_version
                LIMIT 1
                """
            )
        )

        migration_version = (
            migration_result.scalar_one_or_none()
        )

        return {
            "status": "ok",
            "database": "ok",
            "migration": migration_version,
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "error",
                "database": "unavailable",
            },
        )
