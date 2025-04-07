from rest_framework.test import APITestCase
from rest_framework import status
from blog.tag.models import Tag, TagTranslation
from rest_framework.test import APIClient
from const import Urls
from ...helpers import login
from ...factory import create_admin_user, create_student_user, create_tag


class TagViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.POST_TAG}"

        # Create admin and regular user
        self.admin_user, self.admin_data = create_admin_user()
        self.regular_user, self.regular_user_data = create_student_user()

        # Create a course tag and translations
        self.tag, self.tag_data = create_tag()

    # CREATE (Only Admin)
    def test_create_tag_admin(self):
        login(self, self.admin_data["email"], self.admin_data["password"])
        data = {"slug": "backend", "language": "en", "name": "Backend"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tag.objects.count(), 2)
        self.assertEqual(
            TagTranslation.objects.get(tag__slug="backend").name,
            "Backend",
        )

    def test_create_tag_regular_user(self):
        login(self, self.regular_user_data["email"], self.regular_user_data["password"])
        data = {"slug": "backend", "language": "en", "name": "Backend"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # READ (Allowed for Everyone)
    def test_get_course_tags_regular_user(self):
        """Ensure users can fetch course tags in their preferred language."""
        login(self, self.regular_user_data["email"], self.regular_user_data["password"])
        self.client.credentials(HTTP_ACCEPT_LANGUAGE="pl")
        response = self.client.get(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["translated_name"], self.tag_data["pl"]["name"]
        )

    def test_get_course_tags_anonymous(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["translated_name"], self.tag_data["en"]["name"]
        )

    # UPDATE TRANSLATION (Only Admin)
    def test_update_tag_translation_admin(self):
        """Ensure admins can update translations for existing course tags."""
        login(self, self.admin_data["email"], self.admin_data["password"])
        data = {"slug": "backend", "language": "pl", "name": "Backend"}
        url = f"{self.url}/{self.tag.id}"

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            TagTranslation.objects.get(tag=self.tag, language="pl").name,
            "Backend",
        )

    def test_update_tag_translation_regular_user(self):
        login(self, self.regular_user_data["email"], self.regular_user_data["password"])
        data = {"language": "pl", "name": "Backend"}
        url = f"{self.url}/{self.tag.id}"

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # DELETE (Only Admin)
    def test_delete_tag_admin(self):
        login(self, self.admin_data["email"], self.admin_data["password"])
        url = f"{self.url}/{self.tag.id}"

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tag.objects.filter(slug="frontend").exists())

    def test_delete_tag_regular_user(self):
        login(self, self.regular_user_data["email"], self.regular_user_data["password"])
        url = f"{self.url}/{self.tag.id}"

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
