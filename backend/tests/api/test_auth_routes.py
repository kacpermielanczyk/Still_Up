from fastapi.testclient import TestClient

from tests.factories import make_user


def test_register_returns_201(
    api_app,
    auth_service,
):
    auth_service.register.return_value = (
        make_user()
    )

    with TestClient(api_app) as client:
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "user@example.com",
                "password": "password123",
            },
        )

    assert response.status_code == 201
    assert response.json()["email"] == (
        "user@example.com"
    )


def test_register_schema_validation_runs_before_service(
    api_app,
    auth_service,
):
    with TestClient(api_app) as client:
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "wrong",
                "password": "short",
            },
        )

    assert response.status_code == 422
    auth_service.register.assert_not_awaited()


def test_login_sets_http_only_cookie(
    api_app,
    auth_service,
):
    auth_service.login.return_value = (
        make_user(),
        "jwt-token",
    )

    with TestClient(api_app) as client:
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "user@example.com",
                "password": "password123",
            },
        )

    assert response.status_code == 200
    assert response.json()["user"]["id"] == 1

    cookie = response.headers["set-cookie"]

    assert "access_token=jwt-token" in cookie
    assert "HttpOnly" in cookie


def test_logout_clears_cookie(
    api_app,
):
    with TestClient(api_app) as client:
        client.cookies.set(
            "access_token",
            "old-token",
        )

        response = client.post(
            "/api/v1/auth/logout"
        )

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert (
        "access_token="
        in response.headers["set-cookie"]
    )
