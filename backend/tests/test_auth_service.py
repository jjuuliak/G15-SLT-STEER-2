# noinspection PyUnresolvedReferences
import pytest

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from auth_service import AuthService


def test_access_security():
    assert AuthService.get_access_security() is not None


def test_password_hashing():
    hash_password = AuthService.hash_password("test")

    # Hashing doesn't return empty or non-hashed
    assert hash_password and hash_password != "" and hash_password != "test"

    # check_password returns correct for hashed valid password
    assert AuthService.check_password("test", hash_password) is True

    # check_password returns correct for hashed invalid password
    assert AuthService.check_password("test", AuthService.hash_password("tset")) is False

    # check_password returns correct for empty password
    assert AuthService.check_password("", hash_password) is False

    # check_password returns correct for empty hash
    with pytest.raises(ValueError, match="Invalid salt"):
        AuthService.check_password("test", "")
