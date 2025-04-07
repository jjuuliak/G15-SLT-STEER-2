import http.client
import json


SERVER = "127.0.0.1"
PORT = 8000


# Can't seem to get event loop started to be able to initialize database connection and directly test through FastAPI
# but we have the whole thing running in Docker so we can just do actual requests to the backend
class ResponseFor:

    status = -1
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
