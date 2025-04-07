from const import Urls

def mock_send_message(mock):
    mock.return_value = {}


def mock_auth_return_value(mock, return_value):
    mock.return_value.json.return_value = return_value


def mock_auth_side_effect(mock, side_effects):
    mock.side_effect = side_effects

def get_jwt_token_from_login(self, email, password):
        """Helper method to get JWT token from custom login API."""
        # Assuming you have a login endpoint like /api/login/
        response = self.client.post(
            f"/{Urls.API}/{Urls.LOGIN}",
            {"email": email, "password": password},
            format="json",
        )
        return response.data["access_token"]