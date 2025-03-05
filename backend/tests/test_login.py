# noinspection PyUnresolvedReferences
import pytest

import database_connection

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from routes.login import router


@pytest.fixture(scope="session", autouse=True)
def setup():
    database_connection.create_mongo_client()


client = TestClient(router)


def test_register_and_login():
    register = client.post("/register", json={"name": "test", "email": "test@example.org", "password": "password"})
    assert register.status_code == 200

    login = client.post("/login", json={"email": "test@example.org", "password": "password"})
    assert login.status_code == 200


def test_incorrect_login():
    login = client.post("/login", json={"email": "test@example.org", "password": "incorrect"})
    assert login.status_code == 401
