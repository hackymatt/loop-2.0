from rest_framework.test import APITestCase
from rest_framework import status
from course_level.models import CourseLevel, CourseLevelTranslation
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from const import Urls, UserType
from user.utils import get_unique_username


class CourseLevelViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.COURSE_LEVELS}"

        # Create admin and regular user
        self.admin_data = {"email": "admin@example.com", "password": "admin123"}
        self.admin_user = get_user_model().objects.create_user(
            username=get_unique_username(self.admin_data["email"]),
            email=self.admin_data["email"],
            password=self.admin_data["password"],
            user_type=UserType.ADMIN,
        )

        self.regular_user_data = {"email": "user@example.com", "password": "user123"}
        self.regular_user = get_user_model().objects.create_user(
            username=get_unique_username(self.regular_user_data["email"]),
            email=self.regular_user_data["email"],
            password=self.regular_user_data["password"],
        )

        # Create a course level and translations
        self.course_level = CourseLevel.objects.create(slug="beginner")
        self.translation_en = CourseLevelTranslation.objects.create(
            course_level=self.course_level, language="en", name="Beginner"
        )
        self.translation_pl = CourseLevelTranslation.objects.create(
            course_level=self.course_level, language="pl", name="Początkujący"
        )

    # CREATE (Only Admin)
    def test_create_course_level_admin(self):
        self.client.login(
            email=self.admin_data["email"], password=self.admin_data["password"]
        )  # Log in as admin
        data = {"slug": "intermediate"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            CourseLevel.objects.count(), 2
        )  # Ensure new object was created
        self.assertEqual(
            CourseLevel.objects.get(slug="intermediate").slug, "intermediate"
        )

    def test_create_course_level_regular_user(self):
        self.client.login(
            email=self.regular_user_data["email"],
            password=self.regular_user_data["password"],
        )  # Log in as regular user
        data = {"slug": "intermediate"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )  # Forbidden for regular user

    # READ (Allowed for Everyone)
    def test_get_course_levels_regular_user(self):
        self.client.login(
            email=self.regular_user_data["email"],
            password=self.regular_user_data["password"],
        )  # Log in as regular user
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["results"]), 1
        )  # Ensure we get the data of the course level

    def test_get_course_levels_anonymous(self):
        response = self.client.get(self.url, format="json")  # Test as anonymous user
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["results"]), 1
        )  # Ensure we get the data of the course level

    # UPDATE (Only Admin)
    def test_update_course_level_admin(self):
        self.client.login(
            email=self.admin_data["email"], password=self.admin_data["password"]
        )  # Log in as admin
        data = {"slug": "advanced"}
        url = f"{self.url}/{self.course_level.id}"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CourseLevel.objects.get(slug="advanced").slug, "advanced")

    def test_update_course_level_regular_user(self):
        self.client.login(
            email=self.regular_user_data["email"],
            password=self.regular_user_data["password"],
        )  # Log in as regular user
        data = {"slug": "advanced"}
        url = f"{self.url}/{self.course_level.id}"
        response = self.client.put(url, data, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )  # Forbidden for regular user

    # DELETE (Only Admin)
    def test_delete_course_level_admin(self):
        self.client.login(
            email=self.admin_data["email"], password=self.admin_data["password"]
        )  # Log in as admin
        url = f"{self.url}/{self.course_level.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(CourseLevel.DoesNotExist):
            CourseLevel.objects.get(slug="beginner")

    def test_delete_course_level_regular_user(self):
        self.client.login(
            email=self.regular_user_data["email"],
            password=self.regular_user_data["password"],
        )  # Log in as regular user
        url = f"{self.url}/{self.course_level.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN
        )  # Forbidden for regular user
