from fastapi import APIRouter

from src.api.auth import router as auth_router
from src.api.health import router as health_router
from src.api.monitors import router as monitors_router
from src.api.users import router as users_router


api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(monitors_router)
api_router.include_router(health_router)
