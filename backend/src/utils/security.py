from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from src.config.settings import settings

password_hasher = PasswordHash.recommended()


def hash_password(
    password: str,
) -> str:
    return password_hasher.hash(
        password
    )


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hasher.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    user_id: int,
) -> str:
    now = datetime.now(
        timezone.utc
    )

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": (
            now
            + timedelta(
                minutes=settings.access_token_expire_minutes
            )
        ),
    }

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(
    token: str,
) -> int | None:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[
                settings.jwt_algorithm
            ],
        )

        user_id = payload.get("sub")

        if user_id is None:
            return None

        return int(user_id)

    except (
        jwt.ExpiredSignatureError,
        jwt.InvalidTokenError,
        ValueError,
    ):
        return None
