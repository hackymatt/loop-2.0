from django.test import TestCase
from unittest.mock import patch
from rest_framework import status
from rest_framework.test import APIClient
import jwt
from const import Urls
from ..factory import create_user
from ..helpers import generate_valid_token, generate_expired_token


class ActivateAccountViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.ACTIVATE}"

        self.user, _ = create_user()

        # Generate a valid JWT token
        self.valid_token = generate_valid_token(self.user.id)

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
        self.assertEqual(response.data["root"], "Invalid token")

    def test_activate_account_expired_token(self):
        """
        Test account activation with an expired token.
        """
        expired_token = generate_expired_token(self.user.id)
        data = {"token": expired_token}

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["root"], "Invalid activation link")

    def test_activate_account_user_not_found(self):
        """
        Test account activation with a valid token, but the user doesn't exist.
        """
        # Create an invalid token for a non-existing user ID
        invalid_token = generate_valid_token(
            999999
        )  # Assuming this user doesn't exist

        data = {"token": invalid_token}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["root"], "User not found")