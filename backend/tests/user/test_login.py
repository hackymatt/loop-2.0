from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from const import Urls


class LoginViewTest(APITestCase):
    def setUp(self):
        self.url = f"/{Urls.API}/{Urls.LOGIN}"
        # Create an active user
        self.user = get_user_model().objects.create_user(
            email="testuser@example.com",
            password="testpassword",
            username="testuser",
            is_active=True,
        )

        # Create an inactive user
        self.inactive_user = get_user_model().objects.create_user(
            email="inactive@example.com",
            password="testpassword",
            username="inactive",
            is_active=False,
        )

    def test_successful_login(self):
        """Test login with valid credentials returns 200 and JWT tokens."""
        response = self.client.post(
            self.url,
            {"email": "testuser@example.com", "password": "testpassword"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("refresh_token", response.data)

    def test_invalid_credentials(self):
        """Test login with incorrect credentials returns 400."""
        response = self.client.post(
            self.url,
            {"email": "testuser@example.com", "password": "wrongpassword"},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("root", response.data)

    def test_inactive_user_login(self):
        """Test login with inactive user returns 401."""
        response = self.client.post(
            self.url,
            {"email": "inactive@example.com", "password": "testpassword"},
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("root", response.data)
        self.assertEqual(response.data["root"][0], "Inactive user")

    def test_missing_email_or_password(self):
        """Test login fails when email or password is missing."""
        response = self.client.post(self.url, {"email": "testuser@example.com"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(self.url, {"password": "testpassword"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
