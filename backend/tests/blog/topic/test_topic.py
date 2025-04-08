from django.test import TestCase
from rest_framework import status
from blog.topic.models import Topic, TopicTranslation
from rest_framework.test import APIClient
from const import Urls
from ...helpers import login
from ...factory import create_admin_user, create_student_user, create_topic


class TopicViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.POST_TOPIC}"

        # Create admin and regular user
        self.admin_user, self.admin_user_password = create_admin_user()
        self.regular_user, self.regular_user_password = create_student_user()

        # Create a course topic and translations
        self.topic, self.topic_translations = create_topic()

    # CREATE (Only Admin)
    def test_create_topic_admin(self):
        login(self, self.admin_user.email, self.admin_user_password)
        data = {"slug": "backend", "language": "en", "name": "Backend"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Topic.objects.count(), 2)
        self.assertEqual(
            TopicTranslation.objects.get(topic__slug="backend").name,
            "Backend",
        )

    def test_create_topic_regular_user(self):
        login(self, self.regular_user.email, self.regular_user_password)
        data = {"slug": "backend", "language": "en", "name": "Backend"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # READ (Allowed for Everyone)
    def test_get_course_topics_regular_user(self):
        """Ensure users can fetch course topics in their preferred language."""
        login(self, self.regular_user.email, self.regular_user_password)
        self.client.credentials(HTTP_ACCEPT_LANGUAGE="pl")
        response = self.client.get(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["translated_name"],
            self.topic_translations["pl"].name,
        )

    def test_get_course_topics_anonymous(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["translated_name"],
            self.topic_translations["en"].name,
        )

    # UPDATE TRANSLATION (Only Admin)
    def test_update_topic_translation_admin(self):
        """Ensure admins can update translations for existing course topics."""
        login(self, self.admin_user.email, self.admin_user_password)
        data = {"slug": "backend", "language": "pl", "name": "Backend"}
        url = f"{self.url}/{self.topic.id}"

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            TopicTranslation.objects.get(topic=self.topic, language="pl").name,
            "Backend",
        )

    def test_update_topic_translation_regular_user(self):
        login(self, self.regular_user.email, self.regular_user_password)
        data = {"language": "pl", "name": "Backend"}
        url = f"{self.url}/{self.topic.id}"

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # DELETE (Only Admin)
    def test_delete_topic_admin(self):
        login(self, self.admin_user.email, self.admin_user_password)
        url = f"{self.url}/{self.topic.id}"

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Topic.objects.filter(slug="frontend").exists())

    def test_delete_topic_regular_user(self):
        login(self, self.regular_user.email, self.regular_user_password)
        url = f"{self.url}/{self.topic.id}"

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
