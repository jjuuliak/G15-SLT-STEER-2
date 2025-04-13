from utils.response import ResponseFor
from utils.response import TestAccountFor


def test_chat_history():
    account = TestAccountFor("Chat")
    access_token = account.access_token

    # Get history, should successfully return empty
    response = ResponseFor("POST", "/history",
                           body={"start_index": 0, "count": 10},
                           headers={"Content-Type": "application/json",
                                    "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "history" in response.content
    assert len(response.content["history"]) == 0

    # Clear history, should succeed
    response = ResponseFor("POST", "/clear-history",
                           headers={"Content-Type": "application/json",
                                    "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert len(response.content) == 0

    # Get history, should still successfully return empty
    response = ResponseFor("POST", "/history",
                           body={"start_index": 0, "count": 10},
                           headers={"Content-Type": "application/json",
                                    "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "history" in response.content
    assert len(response.content["history"]) == 0

    account.unregister()

    # We don't have a method to arbitrarily write into history so no more automated tests for now
