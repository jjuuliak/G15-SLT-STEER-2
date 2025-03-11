from time import sleep

from utils.test_response import TestResponseFor


def test_profile():
    # Give backend some time to start
    sleep(15)

    # Register, create test user
    response = TestResponseFor("POST", "/register",
                 body={"name": "User", "email": "user@example.org", "password": "Password123!"},
                 headers={"Content-Type": "application/json"})
    assert response.status == 200
    assert "access_token" in response.content

    access_token = response.content["access_token"]

    # Get profile, should not have "smoking"
    response = TestResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_data" in response.content
    assert "smoking" not in response.content["user_data"] or not response.content["user_data"]["smoking"]

    # Update profile, add "smoking"
    response = TestResponseFor("POST", "/update-profile",
                 body={"smoking": True},
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200

    # Get profile, should have "smoking" now
    response = TestResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_data" in response.content
    assert "smoking" in response.content["user_data"]
    assert response.content["user_data"]["smoking"]

    # Get profile without access token, should not return data
    response = TestResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert "user_data" not in response.content

    # Get profile with invalid access token, should not return data
    response = TestResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer abc"})
    assert response.status == 401
    assert "user_data" not in response.content

    # Update profile without access token, should fail
    response = TestResponseFor("POST", "/update-profile",
                 body={"smoking": False},
                 headers={"Content-Type": "application/json"})
    assert response.status == 401

    # Update profile with invalid access token, should fail
    response = TestResponseFor("POST", "/update-profile",
                 body={"smoking": False},
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer abc"})
    assert response.status == 401

    # Get profile, check "smoking" is still set after invalid modification attempts
    response = TestResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_data" in response.content
    assert "smoking" in response.content["user_data"]
    assert response.content["user_data"]["smoking"]
