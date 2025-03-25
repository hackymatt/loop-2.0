from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from const import Urls


class LogoutViewTest(APITestCase):
    def setUp(self):
        self.url = f"/{Urls.API}/{Urls.LOGOUT}"
        """Set up a user and generate JWT tokens for testing."""
        self.user = get_user_model().objects.create_user(
            email="test@example.com",
            password="password123",
            username="test",
            is_active=True,
        )
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
