# noinspection PyUnresolvedReferences
import pytest

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import chat_history

from google.genai import types


def test_format_history():
    # Empty history
    assert chat_history.format_history([]) == []

    # One question and answer
    assert chat_history.format_history([
        {"system": False, "role": "user", "text": "test question", "time": 1},
        {"system": False, "role": "model", "text": "test answer", "time": 2}]
    ) == [
        types.UserContent(parts=[types.Part.from_text(text="test question")]),
        types.ModelContent(parts=[types.Part.from_text(text="test answer")])
    ]
