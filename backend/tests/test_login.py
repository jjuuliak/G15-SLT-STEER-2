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
    assert "access_token" not in response.content

    # Register
    response = ResponseFor("POST", "/register",
                 body={"name": "Test", "email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content

    # Already registered
    response = ResponseFor("POST", "/register",
                 body={"name": "Testt", "email": "test@example.org", "password": "Test12345."},
                 headers={"Content-Type": "application/json"})
    assert response.status == 409
    assert "access_token" not in response.content

    # Login
    response = ResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content

    # Invalid password
    response = ResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345?"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert "access_token" not in response.content
