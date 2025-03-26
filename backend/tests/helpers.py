def mock_send_message(mock):
    mock.return_value = {}


def mock_auth_return_value(mock, return_value):
    mock.return_value.json.return_value = return_value


def mock_auth_side_effect(mock, side_effects):
    mock.side_effect = side_effects
