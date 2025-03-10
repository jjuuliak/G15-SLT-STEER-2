import http.client
import json
from time import sleep


# Can't seem to get event loop started to be able to initialize database connection and directly test through
# FastAPI here but we have the whole thing running in Docker so we can just do actual requests to the backend
def test_register_then_login():
    # Give backend some time to start
    sleep(15)

    # Register
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("POST", "/register",
                 body=json.dumps({"name": "Test", "email": "test@example.org", "password": "Test12345!"}),
                 headers={"Content-Type": "application/json"})
    response = conn.getresponse()
    assert response.status == 200
    response_data = response.read().decode()
    conn.close()
    response_json = json.loads(response_data)
    assert "access_token" in response_json

    # Login
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("POST", "/login",
                 body=json.dumps({"email": "test@example.org", "password": "Test12345!"}),
                 headers={"Content-Type": "application/json"})
    response = conn.getresponse()
    assert response.status == 200
    response_data = response.read().decode()
    conn.close()
    response_json = json.loads(response_data)
    assert "access_token" in response_json

    # Invalid password
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("POST", "/login",
                 body=json.dumps({"email": "test@example.org", "password": "Test12345?"}),
                 headers={"Content-Type": "application/json"})
    response = conn.getresponse()
    assert response.status == 401
    response_data = response.read().decode()
    conn.close()
    response_json = json.loads(response_data)
    assert "access_token" not in response_json


def test_login_account_not_exists():
    conn = http.client.HTTPConnection("localhost", 8000)
    conn.request("POST", "/login",
                 body=json.dumps({"email": "unknown@example.org", "password": "Test12345!"}),
                 headers={"Content-Type": "application/json"})
    response = conn.getresponse()
    assert response.status == 401
    response_data = response.read().decode()
    conn.close()
    response_json = json.loads(response_data)
    assert "access_token" not in response_json
