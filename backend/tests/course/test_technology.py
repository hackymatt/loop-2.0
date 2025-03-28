from rest_framework.test import APITestCase
from rest_framework import status
from course.technology.models import CourseTechnology, CourseTechnologyTranslation
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from const import Urls, UserType
from user.utils import get_unique_username


class CourseTechnologyViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.COURSE_TECHNOLOGY}"

        # Create admin and regular user
        self.admin_data = {"email": "admin@example.com", "password": "admin123"}
        self.admin_user = get_user_model().objects.create_user(
            username=get_unique_username(self.admin_data["email"]),
            email=self.admin_data["email"],
            password=self.admin_data["password"],
            user_type=UserType.ADMIN,
            is_active=True,
        )

        self.regular_user_data = {"email": "user@example.com", "password": "user123"}
        self.regular_user = get_user_model().objects.create_user(
            username=get_unique_username(self.regular_user_data["email"]),
            email=self.regular_user_data["email"],
            password=self.regular_user_data["password"],
            is_active=True,
        )

        # Create a course technology and translations
        self.course_technology = CourseTechnology.objects.create(slug="typescript")
        self.translation_en = CourseTechnologyTranslation.objects.create(
            course_technology=self.course_technology, language="en", name="TypeScript"
        )
        self.translation_pl = CourseTechnologyTranslation.objects.create(
            course_technology=self.course_technology, language="pl", name="TypeScript"
        )

    def get_jwt_token_from_login(self, email, password):
        """Helper method to get JWT token from custom login API."""
        # Assuming you have a login endpoint like /api/login/
        response = self.client.post(
            f"/{Urls.API}/{Urls.LOGIN}",
            {"email": email, "password": password},
            format="json",
        )
        return response.data["access_token"]

    # CREATE (Only Admin)
    def test_create_course_technology_admin(self):
        token = self.get_jwt_token_from_login(
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "javascript", "language": "en", "name": "JavaScript"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CourseTechnology.objects.count(), 2)
        self.assertEqual(
            CourseTechnologyTranslation.objects.get(
                course_technology__slug="javascript"
            ).name,
            "JavaScript",
        )

    def test_create_course_technology_regular_user(self):
        token = self.get_jwt_token_from_login(
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "javascript", "language": "en", "name": "JavaScript"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # READ (Allowed for Everyone)
    def test_get_course_technologies_regular_user(self):
        """Ensure users can fetch course technologies in their preferred language."""
        token = self.get_jwt_token_from_login(
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        self.client.credentials(HTTP_ACCEPT_LANGUAGE="pl")
        response = self.client.get(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["translated_name"], "TypeScript")

    def test_get_course_technologies_anonymous(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["translated_name"], "TypeScript")

    # UPDATE TRANSLATION (Only Admin)
    def test_update_course_technology_translation_admin(self):
        """Ensure admins can update translations for existing course technologies."""
        token = self.get_jwt_token_from_login(
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "javascript", "language": "pl", "name": "JavaScript"}
        url = f"{self.url}/{self.course_technology.id}"

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            CourseTechnologyTranslation.objects.get(
                course_technology=self.course_technology, language="pl"
            ).name,
            "JavaScript",
        )

    def test_update_course_technology_translation_regular_user(self):
        token = self.get_jwt_token_from_login(
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"language": "pl", "name": "JavaScript"}
        url = f"{self.url}/{self.course_technology.id}"

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # DELETE (Only Admin)
    def test_delete_course_technology_admin(self):
        token = self.get_jwt_token_from_login(
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        url = f"{self.url}/{self.course_technology.id}"

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CourseTechnology.objects.filter(slug="typescript").exists())

    def test_delete_course_technology_regular_user(self):
        token = self.get_jwt_token_from_login(
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        url = f"{self.url}/{self.course_technology.id}"

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
