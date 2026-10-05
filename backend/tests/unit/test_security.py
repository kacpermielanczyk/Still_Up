from datetime import datetime, timedelta, timezone

import jwt

from src.config.settings import settings
from src.utils.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_is_hashed_and_verifiable():
    password = "super-secret-password"

    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong-password", hashed) is False


def test_access_token_roundtrip():
    token = create_access_token(user_id=123)

    assert decode_access_token(token) == 123


def test_expired_access_token_is_rejected():
    now = datetime.now(timezone.utc)

    token = jwt.encode(
        {
            "sub": "123",
            "iat": now - timedelta(hours=2),
            "exp": now - timedelta(hours=1),
        },
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )

    assert decode_access_token(token) is None


def test_token_without_subject_is_rejected():
    now = datetime.now(timezone.utc)

    token = jwt.encode(
        {
            "iat": now,
            "exp": now + timedelta(minutes=5),
        },
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )

    assert decode_access_token(token) is None


def test_garbage_token_is_rejected():
    assert decode_access_token("not-a-jwt") is None
