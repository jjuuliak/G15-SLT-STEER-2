import pytest
from google.api_core.exceptions import ServiceUnavailable, BadRequest, NotFound, ServerError

# Assuming send_message is the function you want to test
from LLMService import LLMService

llm_service = LLMService("test")


@pytest.mark.asyncio
async def test_send_message_service_unavailable(mocker):

    # Mock the send_message method to raise an exception
    mock_send = mocker.patch.object(llm_service, 'send_message', side_effect=ServiceUnavailable("503 Service is down"))

    # Test that the exception is raised when calling send_message
    with pytest.raises(ServiceUnavailable):
        await llm_service.send_message("test message")

    # Optionally, check that the mock was called
    mock_send.assert_called_once()

@pytest.mark.asyncio
async def test_send_message_bad_request(mocker):
    # Mock the API call to raise a BadRequest error
    mock_send = mocker.patch("mymodule.send_message", side_effect=BadRequest("400 Invalid request"))

    # Test that the exception is raised
    with pytest.raises(BadRequest):
        await llm_service.send_message("test message")

    mock_send.assert_called_once()

@pytest.mark.asyncio
async def test_send_message_not_found(mocker):
    # Mock the API call to raise a NotFound error
    mock_send = mocker.patch("mymodule.send_message", side_effect=NotFound("404 Resource not found"))

    # Test that the exception is raised
    with pytest.raises(NotFound):
        await llm_service.send_message("test message")

    mock_send.assert_called_once()

@pytest.mark.asyncio
async def test_send_message_server_error(mocker):
    # Mock the API call to raise a ServerError
    mock_send = mocker.patch("mymodule.send_message", side_effect=ServerError("500 Internal API error"))

    # Test that the exception is raised
    with pytest.raises(ServerError):
        await llm_service.send_message("test message")

    mock_send.assert_called_once()