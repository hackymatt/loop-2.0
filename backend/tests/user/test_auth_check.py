from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from const import Urls
from ..factory import create_student
from ..helpers import login


class AuthCheckViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.AUTH_CHECK}"

        self.student, self.student_password = create_student()

    def test_unauthenticated_user(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["authenticated"], False)

    def test_authenticated_user(self):
        login(self, self.student.user.email, self.student_password)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["authenticated"], True)
