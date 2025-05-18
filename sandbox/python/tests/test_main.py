import json
from unittest.mock import MagicMock, patch
import pytest
from main import callback


@pytest.fixture(autouse=True)
def mock_env(monkeypatch):
    monkeypatch.setenv("USER_ID", "test-user")


@patch("main.process_job")
@patch("main.publish")
def test_callback_with_dict_result(mock_publish, mock_process_job):
    # Arrange
    body = json.dumps(
        {
            "job_id": "123",
            "files": [{"name": "test.sh", "path": None, "code": "echo hello"}],
            "command": "bash test.sh",
            "timeout": 10,
        }
    )
    mock_process_job.return_value = {"stdout": "hello", "exit_code": 0}

    channel = MagicMock()
    method = MagicMock()
    method.delivery_tag = "abc"
    properties = MagicMock()

    # Act
    callback(channel, method, properties, body)

    # Assert
    mock_process_job.assert_called_once_with(body)
    mock_publish.assert_called_once_with(
        channel, {"stdout": "hello", "exit_code": 0}, "123", properties
    )
    channel.basic_ack.assert_called_once_with(delivery_tag="abc")


@patch("main.process_job")
@patch("main.publish")
def test_callback_with_generator_result(mock_publish, mock_process_job):
    body = json.dumps(
        {
            "job_id": "456",
            "files": [{"name": "test.sh", "path": None, "code": "echo part"}],
            "command": "bash test.sh",
            "timeout": 10,
            "stream": True,
        }
    )

    # Simulate streaming result (list of 2 outputs)
    mock_process_job.return_value = [
        {"stdout": ["part1"], "stderr": []},
        {"stdout": ["part1", "part2"], "stderr": []},
    ]

    channel = MagicMock()
    method = MagicMock()
    method.delivery_tag = "def"
    properties = MagicMock()

    callback(channel, method, properties, body)

    assert mock_publish.call_count == 2
    mock_publish.assert_any_call(
        channel, {"stdout": ["part1"], "stderr": []}, "456", properties
    )
    mock_publish.assert_any_call(
        channel, {"stdout": ["part1", "part2"], "stderr": []}, "456", properties
    )
    channel.basic_ack.assert_called_once_with(delivery_tag="def")


def test_callback_handles_exception():
    body = json.dumps(
        {
            "job_id": "999",
            "files": [],
            "command": "echo fail",
            "timeout": 10,
        }
    )

    channel = MagicMock()
    method = MagicMock()
    method.delivery_tag = "zzz"
    properties = MagicMock()

    # Should not raise
    callback(channel, method, properties, body)

    channel.basic_ack.assert_called_once_with(delivery_tag="zzz")


@patch("main.process_job", side_effect=ValueError("Boom"))
@patch("main.publish")  # publish nie powinien być wywołany
@patch("builtins.print")
def test_callback_exception_handling(mock_print, mock_publish, mock_process_job):
    # Arrange
    body = '{"job_id": "999", "files": [], "command": "", "timeout": 10}'
    channel = MagicMock()
    method = MagicMock()
    method.delivery_tag = "zzz"
    properties = MagicMock()

    # Act
    callback(channel, method, properties, body)

    # Assert
    mock_process_job.assert_called_once()
    mock_publish.assert_not_called()
    channel.basic_ack.assert_called_once_with(delivery_tag="zzz")

    mock_print.assert_any_call("Callback error:", "Boom")
