import pytest
from pydantic import ValidationError

from src.models.enums import HttpMethod, ResourceType
from src.schemas.auth import RegisterRequest
from src.schemas.monitor import (
    MonitorCreateRequest,
    MonitorUpdateRequest,
)


def test_register_rejects_invalid_email():
    with pytest.raises(ValidationError):
        RegisterRequest(
            email="not-an-email",
            password="password123",
        )


def test_register_rejects_short_password():
    with pytest.raises(ValidationError):
        RegisterRequest(
            email="test@example.com",
            password="short",
        )


def test_monitor_create_accepts_valid_payload():
    data = MonitorCreateRequest(
        name="Portfolio",
        resource_type=ResourceType.WEBSITE,
        url="https://example.com",
        method=HttpMethod.GET,
        interval_seconds=60,
        timeout_seconds=5,
        expected_status_code=200,
    )

    assert data.name == "Portfolio"
    assert str(data.url) == "https://example.com/"
    assert data.interval_seconds == 60


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("interval_seconds", 9),
        ("interval_seconds", 3601),
        ("timeout_seconds", 0),
        ("timeout_seconds", 31),
        ("expected_status_code", 99),
        ("expected_status_code", 600),
        ("failure_threshold", 0),
        ("recovery_threshold", 11),
    ],
)
def test_monitor_create_rejects_out_of_range_values(
    field,
    value,
):
    payload = {
        "name": "API",
        "resource_type": "api",
        "url": "https://example.com/health",
        field: value,
    }

    with pytest.raises(ValidationError):
        MonitorCreateRequest(**payload)


def test_monitor_create_rejects_invalid_url():
    with pytest.raises(ValidationError):
        MonitorCreateRequest(
            name="Broken",
            resource_type="website",
            url="not-a-url",
        )


def test_monitor_update_tracks_only_explicit_fields():
    data = MonitorUpdateRequest(
        enabled=False,
    )

    assert data.model_dump(
        exclude_unset=True
    ) == {
        "enabled": False,
    }
