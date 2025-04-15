from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from const import Urls
from ..factory import create_student, create_certificate
from ..helpers import login


class CertificateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.CERTIFICATE}"

        self.student_1, self.student_1_password = create_student()
        self.student_2, self.student_2_password = create_student()

        self.certificate_1 = create_certificate()
        self.certificate_1.student = self.student_1
        self.certificate_1.save()

        self.certificate_2 = create_certificate()
        self.certificate_1.student = self.student_1
        self.certificate_1.save()

    def test_retrieve_certificate_public(self):
        response = self.client.get(f"{self.url}/{self.certificate_2.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(self.certificate_2.id))

    def test_list_certificates_authenticated(self):
        login(self, self.student_1.user.email, self.student_1_password)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["id"], str(self.certificate_1.id))

    def test_list_certificates_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
