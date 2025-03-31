import pytest
import json
import asyncio
from unittest.mock import AsyncMock, MagicMock, PropertyMock, call
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable
from google.protobuf.duration_pb2 import Duration
from google.rpc import error_details_pb2
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from LLMService import LLMService
import chat_history


@pytest.fixture
def llm_service(mocker):
    # Patch dependencies before LLMService initialization
    mocker.patch('LLMService.genai.configure')
    mock_session = AsyncMock(spec=['send_message'])
    mock_model = MagicMock(spec=['start_chat'])
    mock_model.start_chat.return_value = mock_session
    mocker.patch('LLMService.genai.GenerativeModel', return_value=mock_model)

    # Patch chat_history functions used within LLMService module scope
    mocker.patch('LLMService.chat_history.load_history', new_callable=AsyncMock, return_value=[])
    mocker.patch('LLMService.chat_history.store_history', new_callable=AsyncMock)

    # Patch asyncio.sleep globally for timing control
    mocker.patch('asyncio.sleep', new_callable=AsyncMock)
    # Patch external helper functions used by the service
    mocker.patch('LLMService.get_prompt', new_callable=AsyncMock, return_value="mocked prompt")

    # Create the service instance. Use a non-"test" key to proceed with initialization.
    service = LLMService(api_key="mock-api-key", model_name="gemini-test")

    # Patch instance methods for finer control in tests
    # The fixture mocks these, tests can override behavior with return_value/side_effect
    mocker.patch.object(service, 'get_session', new_callable=AsyncMock, return_value=mock_session)
    mocker.patch.object(service, 'process_response', new_callable=AsyncMock)
    mocker.patch.object(service, 'get_response', new_callable=AsyncMock)
    mocker.patch.object(service, 'enhance_query', new_callable=AsyncMock, return_value="enhanced query")

    return service


@pytest.mark.asyncio
async def test_send_message_service_unavailable_with_retry(llm_service, mocker):
    """ Test handling of ServiceUnavailable (503) with retry logic. """
    user_id = "test_user_service_unavailable"
    message = "Test service unavailable"
    
    # Define the expected error response after retries fail
    final_expected_yield = json.dumps({
        "response": "Error: The API is temporarily unavailable. Please try again later.\n\nDetails: The model is overloaded. Please try again later."
    })

    # Simulate first and second call failing with ServiceUnavailable
    initial_exception = ServiceUnavailable("The model is overloaded. Please try again later.")
    second_exception = ServiceUnavailable("The model is overloaded. Please try again later.")
    llm_service.get_response.side_effect = [initial_exception, second_exception]

    results = [chunk async for chunk in llm_service.send_message(user_id, message)]

    # Asserts
    assert len(results) == 1, "Should yield exactly one final error message"
    assert results[0] == final_expected_yield, "Final error message mismatch"
    assert llm_service.model.start_chat.call_count == 2, "Session should be reinitialized twice due to 503 errors"
    assert llm_service.get_response.await_count == 2, "Should attempt to get a response twice"
    asyncio.sleep.assert_awaited_once()
    # Ensure no history is stored due to failure
    llm_service.process_response.assert_not_called()
    chat_history.store_history.assert_not_called()


@pytest.mark.asyncio
async def test_send_message_resource_exhausted_with_retry_details(llm_service, mocker):
    """
    Test handling of ResourceExhausted when retry details are present.
    Verifies that the specific error message with retry seconds is yielded.
    """
    user_id = "test_user_exhausted_retry"
    message = "Rate limit me"
    retry_seconds = 5

    # Prepare the desired return value for the 'details' property
    mock_retry_info = error_details_pb2.RetryInfo(
        retry_delay=Duration(seconds=retry_seconds)
    )
    details_to_return = [None, None, mock_retry_info]

    serialized_retry_info = mock_retry_info.SerializeToString()

    resource_exhausted_exception = ResourceExhausted(
        "Rate limit exceeded",
        errors=[{"@type": "type.googleapis.com/google.rpc.RetryInfo", "value": serialized_retry_info}],
        details=[None, None, mock_retry_info]
    )

    llm_service.get_response.side_effect = resource_exhausted_exception

    expected_yield = json.dumps({
        "response": f"Error: API rate limit exceeded. Please try again in {retry_seconds} seconds."
    })

    results = [chunk async for chunk in llm_service.send_message(user_id, message)]

    # Asserts
    assert len(results) == 1, "Should yield exactly one error message"
    assert results[0] == expected_yield, "Yielded error message mismatch"

    # Verify calls
    llm_service.get_session.assert_awaited_once_with(user_id)
    llm_service.get_response.assert_awaited_once_with(user_id, message, llm_service.get_session.return_value)
    llm_service.process_response.assert_not_called()
    chat_history.store_history.assert_not_called()
    asyncio.sleep.assert_not_called()