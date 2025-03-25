from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
import jwt
import datetime
from const import Urls
from global_config import CONFIG

class PasswordResetConfirmTests(APITestCase):
    def setUp(self):
        self.url = f"/{Urls.API}/{Urls.PASSWORD_RESET_CONFIRM}"
        """Create a test user."""
        self.user = get_user_model().objects.create_user(
            email="test@example.com", password="OldPassword123", username="test"
        )

        # Generate a valid JWT token for the user
        self.valid_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.datetime.now(
            datetime.timezone.utc
        ) + datetime.timedelta(hours=1),  # 1-hour expiration
            },
            CONFIG["secret"],
            algorithm="HS256",
        )

        # Generate an expired JWT token
        self.expired_token = jwt.encode(
            {
                "user_id": self.user.id,
                "exp": datetime.datetime.now(
            datetime.timezone.utc
        ) - datetime.timedelta(hours=1),  # Expired 1 hour ago
            },
            CONFIG["secret"],
            algorithm="HS256",
        )

        # Invalid token (corrupted string)
        self.invalid_token = "invalid.token.string"

        # Nonexistent user token
        self.nonexistent_user_token = jwt.encode(
            {
                "user_id": 9999,  # User ID that does not exist
                "exp": datetime.datetime.now(
            datetime.timezone.utc
        ) + datetime.timedelta(hours=1),
            },
            CONFIG["secret"],
            algorithm="HS256",
        )

        

    def test_successful_password_reset(self):
        """Ensure a valid token allows password reset."""
        response = self.client.post(
            self.url,
            {"token": self.valid_token, "password": "NewSecurePass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

        # Ensure the password has actually changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewSecurePass123!"))

    def test_expired_token(self):
        """Ensure an expired token returns a 400 error."""
        response = self.client.post(
            self.url,
            {"token": self.expired_token, "password": "NewSecurePass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid reset password link")

    def test_invalid_token(self):
        """Ensure an invalid token returns a 400 error."""
        response = self.client.post(
            self.url,
            {"token": self.invalid_token, "password": "NewSecurePass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid token")

    def test_nonexistent_user(self):
        """Ensure a token for a nonexistent user returns a 404 error."""
        response = self.client.post(
            self.url,
            {"token": self.nonexistent_user_token, "password": "NewSecurePass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "User not found")

    def test_missing_token(self):
        """Ensure request without a token fails."""
        response = self.client.post(
            self.url,
            {"password": "NewSecurePass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_password(self):
        """Ensure request without a password fails."""
        response = self.client.post(
            self.url,
            {"token": self.valid_token},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_password(self):
        """Ensure request with invalid password fails."""
        response = self.client.post(
            self.url,
            {"token": self.valid_token, "password": "NewSecurePass123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
