from fastapi.testclient import TestClient


def test_get_current_user(
    api_app,
    current_user,
):
    with TestClient(api_app) as client:
        response = client.get(
            "/api/v1/users/me"
        )

    assert response.status_code == 200
    assert response.json()["id"] == (
        current_user.id
    )
    assert response.json()["email"] == (
        current_user.email
    )
