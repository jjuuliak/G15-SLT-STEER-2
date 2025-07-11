from utils.response import ResponseFor, AccountFor


def test_profile():
    account = AccountFor("Profile")
    access_token = account.access_token

    # Get profile, should not have "smoking"
    response = ResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_data" in response.content
    assert "smoking" not in response.content["user_data"] or not response.content["user_data"]["smoking"]

    # Update profile, add "smoking"
    response = ResponseFor("POST", "/update-profile",
                 body={"smoking": True},
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert len(response.content) == 0

    # Get profile, should have "smoking" now
    response = ResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_data" in response.content
    assert "smoking" in response.content["user_data"]
    assert response.content["user_data"]["smoking"]

    # Get profile without access token, should not return data
    response = ResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert len(response.content) == 0
    assert "user_data" not in response.content

    # Get profile with invalid access token, should not return data
    response = ResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer abc"})
    assert response.status == 401
    assert len(response.content) == 0
    assert "user_data" not in response.content

    # Update profile without access token, should fail
    response = ResponseFor("POST", "/update-profile",
                 body={"smoking": False},
                 headers={"Content-Type": "application/json"})
    assert response.status == 401
    assert len(response.content) == 0

    # Update profile with invalid access token, should fail
    response = ResponseFor("POST", "/update-profile",
                 body={"smoking": False},
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer abc"})
    assert response.status == 401
    assert len(response.content) == 0

    # Get profile, check "smoking" is still set after invalid modification attempts
    response = ResponseFor("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_data" in response.content
    assert "smoking" in response.content["user_data"]
    assert response.content["user_data"]["smoking"]

    account.unregister()
