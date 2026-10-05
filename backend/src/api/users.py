from fastapi import APIRouter

from src.api.dependencies import CurrentUser
from src.schemas.user import UserResponse

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
async def get_me(
    current_user: CurrentUser,
):
    return current_user
