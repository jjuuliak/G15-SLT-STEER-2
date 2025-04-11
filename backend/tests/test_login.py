from time import sleep

from utils.response import ResponseFor


def test_register_and_login():
    # Give backend some time to start
    sleep(15)

    # Account doesn't exist
    response = ResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert len(response.content) == 0
    assert "access_token" not in response.content
    assert "refresh_token" not in response.content

    # Register
    response = ResponseFor("POST", "/register",
                 body={"name": "Test", "email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content
    assert "refresh_token" in response.content

    # Already registered
    response = ResponseFor("POST", "/register",
                 body={"name": "Testt", "email": "test@example.org", "password": "Test12345."},
                 headers={"Content-Type": "application/json"})
    assert response.status == 409
    assert len(response.content) == 0
    assert "access_token" not in response.content
    assert "refresh_token" not in response.content

    # Login
    response = ResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content
    assert "refresh_token" in response.content

    refresh_token = response.content["refresh_token"]

    # Invalid password
    response = ResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345?"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert len(response.content) == 0
    assert "access_token" not in response.content
    assert "refresh_token" not in response.content

    # Refresh
    response = ResponseFor("POST", "/refresh",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {refresh_token}"})
    assert response.status == 200
    assert "access_token" in response.content

    # Logout
    response = ResponseFor("POST", "/logout",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {refresh_token}"})
    assert response.status == 200
    assert len(response.content) == 0

    # Refresh after logout should fail
    response = ResponseFor("POST", "/refresh",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {refresh_token}"})
    assert response.status == 401
    assert len(response.content) == 0
    assert "access_token" not in response.content
    assert "refresh_token" not in response.content

    # Delete account after logout should fail
    response = ResponseFor("POST", "/unregister",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {refresh_token}"})
    assert response.status == 401
    assert len(response.content) == 0
    assert "access_token" not in response.content
    assert "refresh_token" not in response.content

    # Log back in
    response = ResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content
    assert "refresh_token" in response.content

    refresh_token = response.content["refresh_token"]

    # Deleting account should succeed
    response = ResponseFor("POST", "/unregister",
                           headers={"Content-Type": "application/json",
                                    "Authorization": f"Bearer {refresh_token}"})
    assert response.status == 200
    assert len(response.content) == 0

    # Account was deleted, login should fail
    response = ResponseFor("POST", "/login",
                           body={"email": "test@example.org", "password": "Test12345!"},
                           headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert len(response.content) == 0
    assert "access_token" not in response.content
    assert "refresh_token" not in response.content

    # Account was deleted, refresh should fail
    response = ResponseFor("POST", "/refresh",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {refresh_token}"})
    assert response.status == 401
    assert len(response.content) == 0
    assert "access_token" not in response.content
    assert "refresh_token" not in response.content
