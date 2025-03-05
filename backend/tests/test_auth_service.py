# noinspection PyUnresolvedReferences
import pytest

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from auth_service import AuthService


def test_get_access_security():
    assert AuthService.get_access_security() is not None


def test_hash_password():
    hash = AuthService.hash_password("test")
    assert hash and hash != "" and hash != "test"


def test_check_password():
    assert AuthService.check_password("test", AuthService.hash_password("test")) is True

    with pytest.raises(ValueError, match="Invalid salt"):
        AuthService.check_password("test", "")
