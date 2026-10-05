from functools import lru_cache
from pathlib import Path
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "StillUp API"
    app_env: str = "development"
    debug: bool = True
    version: str = "0.1.0"

    api_prefix: str = "/api/v1"
    frontend_url: str = "http://localhost:5173"

    db_host: str = "127.0.0.1"
    db_port: int = 5432
    db_name: str = "stillup"
    db_user: str = "postgres"
    db_password: str = "postgres"

    auto_migrate: bool = True

    worker_poll_seconds: int = 5
    worker_batch_size: int = 50
    worker_concurrency: int = 10

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cookie_secure: bool = False

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        username = quote_plus(self.db_user)
        password = quote_plus(self.db_password)

        return (
            "postgresql+asyncpg://"
            f"{username}:{password}@"
            f"{self.db_host}:{self.db_port}/"
            f"{self.db_name}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
