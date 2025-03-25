def mock_send_message(mock):
    mock.return_value = {}


def mock_google_auth(mock, return_value):
    mock.return_value.json.return_value = return_value
