import http.client
import json


def test_profile():
    # Register
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("POST", "/register",
                 body=json.dumps({"name": "User", "email": "user@example.org", "password": "Password123!"}),
                 headers={"Content-Type": "application/json"})
    response = conn.getresponse()
    assert response.status == 200
    response_data = response.read().decode()
    conn.close()
    response_json = json.loads(response_data)
    assert "access_token" in response_json

    access_token = response_json["access_token"]

    # Get profile, should not have "smoking"
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    response = conn.getresponse()
    assert response.status == 200
    response_data = response.read().decode()
    conn.close()
    response_json = json.loads(response_data)
    assert "user_data" in response_json
    assert "smoking" not in response_json["user_data"] or not response_json["user_data"]["smoking"]

    # Update profile, add "smoking"
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("POST", "/update-profile",
                 body=json.dumps({"smoking": True}),
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    response = conn.getresponse()
    assert response.status == 200
    conn.close()

    # Get profile, should have "smoking" now
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("POST", "/get-profile",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    response = conn.getresponse()
    assert response.status == 200
    response_data = response.read().decode()
    conn.close()
    response_json = json.loads(response_data)
    assert "user_data" in response_json
    assert "smoking" in response_json["user_data"] and response_json["user_data"]["smoking"]
