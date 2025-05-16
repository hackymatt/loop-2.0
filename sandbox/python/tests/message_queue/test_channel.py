import importlib
from unittest.mock import patch, MagicMock
import pytest

from message_queue import channel


@pytest.fixture(autouse=True)
def set_env(monkeypatch):
    monkeypatch.setenv("USER_ID", "testuser")
    monkeypatch.setenv("RABBITMQ_HOST", "localhost")
    monkeypatch.setenv("RABBITMQ_PORT", "5672")

    importlib.reload(channel)
    return channel


@patch("message_queue.channel.pika.BlockingConnection")
def test_setup_channel(mock_blocking_connection):
    # Create mock objects
    mock_connection = MagicMock()
    mock_channel = MagicMock()
    mock_connection.channel.return_value = mock_channel
    mock_blocking_connection.return_value = mock_connection

    # Act
    setup_channel = channel.setup_channel()

    # Assert that channel is returned correctly
    assert setup_channel == mock_channel

    # Verify RabbitMQ setup calls
    mock_blocking_connection.assert_called_once()
    mock_channel.exchange_declare.assert_called_once_with(
        exchange="sandboxExchange", exchange_type="direct", durable=True
    )
    mock_channel.queue_declare.assert_any_call(
        queue="jobs.python-sandbox.testuser", durable=True
    )
    mock_channel.queue_bind.assert_called_once_with(
        exchange="sandboxExchange",
        queue="jobs.python-sandbox.testuser",
        routing_key="jobs.python-sandbox.testuser",
    )
    mock_channel.queue_declare.assert_any_call(
        queue="results.python-sandbox.testuser", durable=True
    )
