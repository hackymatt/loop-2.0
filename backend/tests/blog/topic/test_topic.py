from rest_framework.test import APITestCase
from rest_framework import status
from blog.topic.models import Topic, TopicTranslation
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from const import Urls, UserType
from user.utils import get_unique_username
from ...helpers import get_jwt_token_from_login

class TopicViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.POST_TOPIC}"

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

        # Create a course topic and translations
        self.topic = Topic.objects.create(slug="frontend")
        self.translation_en = TopicTranslation.objects.create(
            topic=self.topic, language="en", name="Frontend"
        )
        self.translation_pl = TopicTranslation.objects.create(
            topic=self.topic, language="pl", name="Frontend"
        )

    # CREATE (Only Admin)
    def test_create_topic_admin(self):
        token = get_jwt_token_from_login(self,
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "backend", "language": "en", "name": "Backend"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Topic.objects.count(), 2)
        self.assertEqual(
            TopicTranslation.objects.get(topic__slug="backend").name,
            "Backend",
        )

    def test_create_topic_regular_user(self):
        token = get_jwt_token_from_login(self,
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "backend", "language": "en", "name": "Backend"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # READ (Allowed for Everyone)
    def test_get_course_topics_regular_user(self):
        """Ensure users can fetch course topics in their preferred language."""
        token = get_jwt_token_from_login(self,
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        self.client.credentials(HTTP_ACCEPT_LANGUAGE="pl")
        response = self.client.get(self.url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["translated_name"], "Frontend")

    def test_get_course_topics_anonymous(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["translated_name"], "Frontend")

    # UPDATE TRANSLATION (Only Admin)
    def test_update_topic_translation_admin(self):
        """Ensure admins can update translations for existing course topics."""
        token = get_jwt_token_from_login(self,
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "backend", "language": "pl", "name": "Backend"}
        url = f"{self.url}/{self.topic.id}"

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            TopicTranslation.objects.get(topic=self.topic, language="pl").name,
            "Backend",
        )

    def test_update_topic_translation_regular_user(self):
        token = get_jwt_token_from_login(self,
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"language": "pl", "name": "Backend"}
        url = f"{self.url}/{self.topic.id}"

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # DELETE (Only Admin)
    def test_delete_topic_admin(self):
        token = get_jwt_token_from_login(self,
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        url = f"{self.url}/{self.topic.id}"

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Topic.objects.filter(slug="frontend").exists())

    def test_delete_topic_regular_user(self):
        token = get_jwt_token_from_login(self,
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        url = f"{self.url}/{self.topic.id}"

        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
