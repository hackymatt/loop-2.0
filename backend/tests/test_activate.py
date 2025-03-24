from django.test import TestCase
from unittest.mock import patch
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
import jwt
import datetime
from const import Urls
from global_config import CONFIG


class ActivateAccountViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.ACTIVATE}"

        self.user = get_user_model().objects.create_user(
            email="testuser@example.com", password="Test1234!", username="testuser"
        )

        # Generate a valid JWT token
        self.valid_token = self.generate_valid_token(self.user.id)

    def generate_valid_token(self, user_id):
        # Generate a valid JWT token that expires in 1 hour
        expiration_time = datetime.datetime.now(
            datetime.timezone.utc
        ) + datetime.timedelta(hours=24)
        payload = {"user_id": user_id, "exp": expiration_time}
        return jwt.encode(payload, CONFIG["secret"], algorithm="HS256")

    def test_activate_account_success(self):
        """
        Test account activation with a valid token and inactive user.
        """
        self.user.is_active = False
        self.user.save()

        data = {"token": self.valid_token}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)

    def test_activate_account_already_active(self):
        """
        Test account activation with a valid token but the user is already active.
        """
        self.user.is_active = True
        self.user.save()

        data = {"token": self.valid_token}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

    @patch("user.activate.views.jwt.decode")
    def test_activate_account_invalid_token(self, mock_jwt_decode):
        """
        Test account activation with an invalid token.
        """
        # Simulate an invalid token by raising an exception
        mock_jwt_decode.side_effect = jwt.InvalidTokenError

        data = {"token": "invalid_token"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid token")

    def test_activate_account_expired_token(self):
        """
        Test account activation with an expired token.
        """
        expired_token = self.generate_expired_token(self.user.id)
        data = {"token": expired_token}

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid activation link")

    def test_activate_account_user_not_found(self):
        """
        Test account activation with a valid token, but the user doesn't exist.
        """
        # Create an invalid token for a non-existing user ID
        invalid_token = self.generate_valid_token(
            999999
        )  # Assuming this user doesn't exist

        data = {"token": invalid_token}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "User not found")

    def generate_expired_token(self, user_id):
        """
        Generate a token that is already expired.
        """
        expiration_time = datetime.datetime.now(datetime.timezone.utc)  # Expired token
        payload = {"user_id": user_id, "exp": expiration_time}
        return jwt.encode(payload, CONFIG["secret"], algorithm="HS256")
