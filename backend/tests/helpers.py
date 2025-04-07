from const import Urls
import jwt
import datetime
from global_config import CONFIG


def mock_send_message(mock):
    mock.return_value = {}


def mock_auth_return_value(mock, return_value):
    mock.return_value.json.return_value = return_value


def mock_auth_side_effect(mock, side_effects):
    mock.side_effect = side_effects


def generate_valid_token(user_id):
    # Generate a valid JWT token that expires in 1 hour
    expiration_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
        hours=24
    )
    payload = {"user_id": user_id, "exp": expiration_time}
    return jwt.encode(payload, CONFIG["secret"], algorithm="HS256")


def generate_expired_token(user_id):
    """
    Generate a token that is already expired.
    """
    expiration_time = datetime.datetime.now(datetime.timezone.utc)  # Expired token
    payload = {"user_id": user_id, "exp": expiration_time}
    return jwt.encode(payload, CONFIG["secret"], algorithm="HS256")


def get_jwt_token_from_login(self, email, password):
    """Helper method to get JWT token from custom login API."""
    # Assuming you have a login endpoint like /api/login/
    response = self.client.post(
        f"/{Urls.API}/{Urls.LOGIN}",
        {"email": email, "password": password},
        format="json",
    )
    return response.data["access_token"]


def login(self, email, password):
    token = get_jwt_token_from_login(self, email, password)
    self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
