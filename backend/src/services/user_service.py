from src.models.user import User


class UserService:
    async def get_current_user(
        self,
        user: User,
    ) -> User:
        return user
