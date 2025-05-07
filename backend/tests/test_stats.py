import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import user_stats
from utils.response import ResponseFor, AccountFor


def test_stats():
    account = AccountFor("Stats")
    access_token = account.access_token

    # Get stats, should have all of them
    response = ResponseFor("POST", "/get-stats",
                 headers={"Content-Type": "application/json",
                          "Authorization": f"Bearer {access_token}"})
    assert response.status == 200
    assert "user_stats" in response.content
    assert len(response.content["user_stats"]) is len(user_stats.LEVELS)
    for stat in response.content["user_stats"]:
        assert "stat" in stat
        assert len(stat["stat"]) > 0
        assert "counter" in stat
        assert stat["counter"] == 0
        assert "increment" in stat
        assert stat["increment"] == 0
        assert "level" in stat
        assert stat["level"] == 0
        assert "levels" in stat
        assert len(stat["levels"]) > 0
        assert "next_level" in stat
        assert stat["next_level"] > 0

    account.unregister()
