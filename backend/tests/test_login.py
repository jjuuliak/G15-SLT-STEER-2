from time import sleep

from utils.test_response import TestResponseFor


def test_register_and_login():
    # Give backend some time to start
    sleep(15)

    # Account doesn't exist
    response = TestResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert "access_token" not in response.content

    # Register
    response = TestResponseFor("POST", "/register",
                 body={"name": "Test", "email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content

    # Already registered
    response = TestResponseFor("POST", "/register",
                 body={"name": "Testt", "email": "test@example.org", "password": "Test12345."},
                 headers={"Content-Type": "application/json"})
    assert response.status == 409
    assert "access_token" not in response.content

    # Login
    response = TestResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content

    # Invalid password
    response = TestResponseFor("POST", "/login",
                 body={"email": "test@example.org", "password": "Test12345?"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert "access_token" not in response.content
