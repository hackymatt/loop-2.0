from unittest.mock import patch, MagicMock
from message_queue import consumer


@patch("message_queue.consumer.setup_channel")
@patch("message_queue.consumer.QUEUE_NAME", "jobs.test")
def test_start_consumer_config_only(mock_setup_channel):
    mock_channel = MagicMock()
    mock_setup_channel.return_value = mock_channel
    mock_callback = MagicMock()

    # Call without triggering start_consuming
    consumer.start_consumer(mock_callback, consume=False)

    mock_channel.basic_qos.assert_called_once_with(prefetch_count=1)
    mock_channel.basic_consume.assert_called_once_with(
        queue="jobs.test", on_message_callback=mock_callback
    )
    mock_channel.start_consuming.assert_not_called()
