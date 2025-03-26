from unittest.mock import patch
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .helpers import mock_auth_return_value
from const import Urls


class FacebookLoginViewTest(APITestCase):
    def setUp(self):
        self.url = f"/{Urls.API}/{Urls.FACEBOOK_LOGIN}"
        self.valid_access_token = "valid_facebook_access_token"
        self.invalid_access_token = "invalid_facebook_access_token"
        self.facebook_user_data = {
            "email": "testuser@example.com",
            "first_name": "Test",
            "last_name": "User",
            "picture": {"data": {"url": "https://example.com/pic.jpg"}},
        }

    @patch("requests.get")
    def test_facebook_login_success(self, get_mock):
        mock_auth_return_value(get_mock, self.facebook_user_data)
        """Test successful login with Facebook"""
        response = self.client.post(
            self.url, {"access_token": self.valid_access_token}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("refresh_token", response.data)
        self.assertEqual(response.data["email"], self.facebook_user_data["email"])

        # Check if the user was created or fetched
        user_exists = (
            get_user_model()
            .objects.filter(email=self.facebook_user_data["email"])
            .exists()
        )
        self.assertTrue(user_exists)

    @patch("requests.get")
    def test_facebook_login_invalid_token(self, get_mock):
        mock_auth_return_value(get_mock, {"error": "Invalid OAuth access token"})
        """Test invalid token during Facebook login"""
        response = self.client.post(
            self.url, {"access_token": self.invalid_access_token}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["root"], "Invalid token")

    def test_facebook_login_no_access_token(self):
        """Test when no access token is provided"""
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["root"], "Access token is required")

    @patch("requests.get")
    def test_facebook_login_missing_email(self, get_mock):
        facebook_data_missing_email = self.facebook_user_data.copy()
        facebook_data_missing_email.pop("email")
        mock_auth_return_value(get_mock, {"error": "Invalid OAuth access token"})
        """Test when the email is missing in the Facebook response"""
        response = self.client.post(
            self.url, {"access_token": self.valid_access_token}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["root"], "Invalid token")
