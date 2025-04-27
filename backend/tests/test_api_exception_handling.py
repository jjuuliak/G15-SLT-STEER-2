import pytest
import json
from unittest.mock import AsyncMock, patch
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from LLMService import LLMService, APIError

@pytest.mark.asyncio
@pytest.mark.parametrize("code, status, expected_msg",
[
    pytest.param(400, 'INVALID_ARGUMENT', "Error: Invalid request.", id="400"),
    pytest.param(400, 'FAILED_PRECONDITION', "Error: Failed precondition.", id="400"),
    pytest.param(403, None, "Error: Permission to the Google API was denied.", id="403"),
    pytest.param(404, None, "Error: The requested resource could not be found.", id="404"),
    pytest.param(429, None, "Error: Google API rate limit exceeded.", id="429"),
    pytest.param(500, None, "Error: An internal error occurred with the Google API.", id="500"),
    pytest.param(503, None, "Error: The Google API is temporarily unavailable.", id="503"),
    pytest.param(504, None, "Error: The Google API is unable to finish processing within the deadline.", id="504"),
])

async def test_send_message_api_exceptions(code, status, expected_msg):
    svc = LLMService(api_key="test")

    error = APIError("test error", {})
    error.code = code
    error.status = status
    error.message = "test error message"

    # Mock exception from get_response
    svc.get_response = AsyncMock(side_effect=error)

    results = []
    async for result in svc.send_message("test_user", "test_message"):
        results.append(json.loads(result))

    # Expect the correct error message
    assert any(expected_msg in item['response'] for item in results)


@pytest.mark.asyncio
async def test_send_message_generic_exception():
    svc = LLMService(api_key="test")

    svc.get_response = AsyncMock(side_effect=ValueError("Some random error"))

    results = []
    async for result in svc.send_message("test_user", "test_message"):
        results.append(json.loads(result))

    assert any("An unexpected error occurred." in item['response'] for item in results)