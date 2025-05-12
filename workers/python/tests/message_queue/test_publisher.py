import json
from unittest.mock import MagicMock

from ...message_queue.publisher import publish
from ...message_queue.channel import RESULT_QUEUE


def test_publish_with_props():
    mock_channel = MagicMock()
    mock_props = MagicMock()
    mock_props.reply_to = "custom.reply"
    mock_props.correlation_id = "abc-123"

    result = {"status": "ok"}
    job_id = "job-1"

    publish(mock_channel, result, job_id, props=mock_props)

    mock_channel.basic_publish.assert_called_once_with(
        exchange="",
        routing_key="custom.reply",
        properties=mock_channel.basic_publish.call_args[1]["properties"],
        body=json.dumps(result),
    )

    props = mock_channel.basic_publish.call_args[1]["properties"]
    assert props.correlation_id == "abc-123"
    assert props.delivery_mode == 2


def test_publish_without_props():
    mock_channel = MagicMock()

    result = {"status": "ok"}
    job_id = "job-2"

    publish(mock_channel, result, job_id, props=None)

    mock_channel.basic_publish.assert_called_once_with(
        exchange="",
        routing_key=RESULT_QUEUE,
        properties=mock_channel.basic_publish.call_args[1]["properties"],
        body=json.dumps(result),
    )

    props = mock_channel.basic_publish.call_args[1]["properties"]
    assert props.correlation_id is None
    assert props.delivery_mode == 2


def test_publish_error():
    result = {"status": "ok"}
    job_id = "job-2"

    publish(None, result, job_id, props=None)
