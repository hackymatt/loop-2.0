from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from const import Urls
from ..factory import create_user


class LogoutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.LOGOUT}"
        """Set up a user and generate JWT tokens for testing."""
        self.user, _ = create_user()
        self.refresh = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh.access_token)
        self.refresh_token = str(self.refresh)

    def test_successful_logout(self):
        """Ensure a user can successfully logout by blacklisting the refresh token."""
        response = self.client.post(
            self.url,
            {"refresh_token": self.refresh_token},
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}",
        )

        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_missing_refresh_token(self):
        """Ensure logout fails if no refresh token is provided."""
        response = self.client.post(
            self.url,
            {},
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("root", response.data)

    def test_invalid_refresh_token(self):
        """Ensure logout fails with an invalid refresh token."""
        response = self.client.post(
            self.url,
            {"refresh_token": "invalid_token"},
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("root", response.data)

    def test_logout_without_authentication(self):
        """Ensure logout fails if user is not authenticated."""
        response = self.client.post(
            self.url,
            {"refresh_token": self.refresh_token},
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
