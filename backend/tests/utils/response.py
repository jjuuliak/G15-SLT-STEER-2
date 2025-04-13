import http.client
import json
from time import sleep

SERVER = "127.0.0.1"
PORT = 8000


# Can't seem to get event loop started to be able to initialize database connection and directly test through FastAPI
# but we have the whole thing running in Docker so we can just do actual requests to the backend
class ResponseFor:
    """
    Sends a request to given endpoint
    """

    # Response status code
    status = -1

    # Response payload
    content = {}

    def __init__(self, method, endpoint, headers, body = None):
        conn = http.client.HTTPConnection(SERVER, PORT)
        conn.request(method, endpoint, headers=headers, body=None if body is None else json.dumps(body))
        response = conn.getresponse()
        self.status = response.status
        if response.status == 200:
            response_data = response.read().decode()
            self.content = json.loads(response_data)
        conn.close()


class TestAccountFor:
    """
    Creates a test account with given name or fails if account cannot be created
    """

    # Access token for created account
    access_token = ""

    # Refresh token for created account
    refresh_token = ""

    def __init__(self, name):
        """
        Registers a test account
        """

        # Give backend some time to start
        sleep(15)

        assert len(name) > 0
        self.name = name
        response = ResponseFor("POST", "/register",
                                  body={"name": name, "email": name + "@example.org", "password": "Password123!"},
                                  headers={"Content-Type": "application/json"})
        assert response.status == 200
        assert "access_token" in response.content
        assert "refresh_token" in response.content
        self.access_token = response.content["access_token"]
        self.refresh_token = response.content["refresh_token"]


    def unregister(self):
        """
        Unregisters the test account
        """

        response = ResponseFor("POST", "/unregister",
                               headers={"Content-Type": "application/json",
                                        "Authorization": f"Bearer {self.refresh_token}"})
        assert response.status == 200
