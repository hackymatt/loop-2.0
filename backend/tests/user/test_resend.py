from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from unittest.mock import patch
from django.contrib.auth import get_user_model
import jwt
import datetime
from const import Urls
from global_config import CONFIG
from utils.google.gmail import GmailApi
from ..helpers import mock_send_message


class ResendActivationLinkViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.RESEND}"
        # Create a test user (inactive)
        self.user = get_user_model().objects.create_user(
            email="user@example.com",
            password="validpassword123",
            username="user",
            is_active=False,
        )

        # Generate a token for the user
        self.token = self.generate_valid_token(self.user.id)

    def generate_valid_token(self, user_id):
        """
        Generate a valid JWT token for a specific user ID.
        """
        expiration_time = datetime.datetime.now(
            datetime.timezone.utc
        ) + datetime.timedelta(hours=24)
        payload = {"user_id": user_id, "exp": int(expiration_time.timestamp())}
        return jwt.encode(payload, CONFIG["secret"], algorithm="HS256")

    @patch.object(GmailApi, "_send_message")  # Mocking send_activation_email
    def test_resend_activation_link_missing_token_and_email(self, send_message_mock):
        mock_send_message(mock=send_message_mock)
        """Test when both token and email are missing."""
        data = {}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["root"], "You must provide either a token or an email."
        )
        send_message_mock.assert_not_called()

    @patch.object(GmailApi, "_send_message")
    def test_resend_activation_link_invalid_token(self, send_message_mock):
        mock_send_message(mock=send_message_mock)
        """Test when the provided token is invalid."""
        invalid_token = "invalidtoken"
        data = {"token": invalid_token}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["root"], "Invalid token.")
        send_message_mock.assert_not_called()

    @patch.object(GmailApi, "_send_message")
    def test_resend_activation_link_user_not_found(self, send_message_mock):
        mock_send_message(mock=send_message_mock)
        """Test when the user is not found (invalid token or email)."""
        non_existing_token = self.generate_valid_token(999999)  # Non-existing user ID
        data = {"token": non_existing_token}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["root"], "User not found.")
        send_message_mock.assert_not_called()

        # Test with email for a non-existing user
        data = {"email": "nonexistent@example.com"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["root"], "User not found.")
        send_message_mock.assert_not_called()

    @patch.object(GmailApi, "_send_message")
    def test_resend_activation_link_active_user(self, send_message_mock):
        mock_send_message(mock=send_message_mock)
        """Test when the user is already active, no email is sent."""
        self.user.is_active = True
        self.user.save()

        data = {"token": self.token}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        send_message_mock.assert_not_called()

    @patch.object(GmailApi, "_send_message")
    def test_resend_activation_link_successful(self, send_message_mock):
        mock_send_message(mock=send_message_mock)
        """Test when the user is inactive and an activation email is sent."""
        data = {"token": self.token}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], self.user.email)
        send_message_mock.assert_called_once()

    @patch.object(GmailApi, "_send_message")
    def test_resend_activation_link_by_email(self, send_message_mock):
        mock_send_message(mock=send_message_mock)
        """Test when activation email is resent by email instead of token."""
        data = {"email": self.user.email}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], self.user.email)
        send_message_mock.assert_called_once()
