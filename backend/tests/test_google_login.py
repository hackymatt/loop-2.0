from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch
from .helpers import mock_auth_return_value
from const import Urls


class GoogleLoginViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.GOOGLE_LOGIN}"
        self.google_data = {
            "email": "testuser@example.com",
            "given_name": "Test",
            "family_name": "User",
            "picture": "https://example.com/avatar.jpg",
        }

    @patch("requests.get")
    def test_google_login_success(self, get_mock):
        """Test successful login using Google OAuth"""
        mock_auth_return_value(get_mock, self.google_data)

        response = self.client.post(self.url, {"token": "valid_token"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("refresh_token", response.data)
        self.assertEqual(response.data["email"], self.google_data["email"])

        # Check if the user was created
        user = get_user_model().objects.filter(email=self.google_data["email"]).first()
        self.assertIsNotNone(user)
        self.assertEqual(user.first_name, self.google_data["given_name"])

    @patch("requests.get")
    def test_google_login_existing_user(self, get_mock):
        """Test login for an existing user"""
        mock_auth_return_value(get_mock, self.google_data)

        get_user_model().objects.create_user(
            email="testuser@example.com",
            username="testuser",
            first_name="Test",
            last_name="User",
            image="https://example.com/avatar.jpg",
        )

        response = self.client.post(self.url, {"token": "valid_token"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("refresh_token", response.data)

        # Ensure the user still exists and was not duplicated
        users_count = (
            get_user_model().objects.filter(email="testuser@example.com").count()
        )
        self.assertEqual(users_count, 1)

    @patch("requests.get")
    def test_google_login_invalid_token(self, get_mock):
        """Test invalid Google OAuth token"""
        mock_auth_return_value(get_mock, {"error": "Invalid Token"})

        response = self.client.post(self.url, {"token": "invalid_token"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["root"], "Invalid token")

    def test_google_login_missing_token(self):
        """Test missing token in request"""
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
