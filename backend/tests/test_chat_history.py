# noinspection PyUnresolvedReferences
import pytest

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import chat_history


def test_format_history():
    assert chat_history.format_history([]) == []
    assert chat_history.format_history([
        {"role": "test role 1", "text": "test message 1", "time": 1},
        {"role": "test role 2", "text": "test message 2", "time": 2}]
    ) == [
        {"role": "test role 1", "parts": [{"text": "test message 1"}]},
        {"role": "test role 2", "parts": [{"text": "test message 2"}]}
    ]
