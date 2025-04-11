from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from const import Urls
from ..factory import create_user


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.LOGIN}"
        # Create an active user
        self.user, self.user_password = create_user()

        # Create an inactive user
        self.inactive_user, self.inactive_user_password = create_user()
        self.inactive_user.is_active = False
        self.inactive_user.save()

    def test_successful_login(self):
        """Test login with valid credentials returns 200 and JWT tokens."""
        response = self.client.post(
            self.url,
            {"email": self.user.email, "password": self.user_password},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["first_name"], self.user.first_name)
        self.assertEqual(response.data["last_name"], self.user.last_name)

    def test_invalid_credentials(self):
        """Test login with incorrect credentials returns 400."""
        response = self.client.post(
            self.url,
            {"email": self.user.email, "password": "wrongpassword"},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("root", response.data)

    def test_inactive_user_login(self):
        """Test login with inactive user returns 401."""
        response = self.client.post(
            self.url,
            {
                "email": self.inactive_user.email,
                "password": self.inactive_user_password,
            },
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("root", response.data)
        self.assertEqual(response.data["root"][0], "Inactive user")

    def test_missing_email_or_password(self):
        """Test login fails when email or password is missing."""
        response = self.client.post(self.url, {"email": self.user.email})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(self.url, {"password": self.user_password})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
