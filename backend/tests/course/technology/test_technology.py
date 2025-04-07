from rest_framework.test import APITestCase
from rest_framework import status
from course.technology.models import Technology
from course.level.models import Level
from course.category.models import Category
from course.enrollment.models import CourseEnrollment
from course.models import Course
from review.models import Review
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from const import Urls, UserType
from user.type.student_user.models import Student
from user.utils import get_unique_username
from ...helpers import get_jwt_token_from_login

class TechnologyViewTest(APITestCase):
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

        # Create a course technology
        self.course_technology = Technology.objects.create(
            slug="typescript", name="TypeScript"
        )

    # CREATE (Only Admin)
    def test_create_course_technology_admin(self):
        token = get_jwt_token_from_login(self,
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "javascript", "name": "JavaScript"}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Technology.objects.count(), 2)

    def test_create_course_technology_regular_user(self):
        token = get_jwt_token_from_login(self,
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "javascript", "name": "JavaScript"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # READ (Allowed for Everyone)
    def test_get_course_technologies(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["name"], "TypeScript")

    # UPDATE (Only Admin)
    def test_update_course_technology_admin(self):
        token = get_jwt_token_from_login(self,
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"slug": "typescript", "name": "TS"}
        url = f"{self.url}/{self.course_technology.id}"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course_technology.refresh_from_db()
        self.assertEqual(self.course_technology.name, "TS")

    def test_update_course_technology_regular_user(self):
        token = get_jwt_token_from_login(self,
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        data = {"name": "TS"}
        url = f"{self.url}/{self.course_technology.id}"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # DELETE (Only Admin)
    def test_delete_course_technology_admin(self):
        token = get_jwt_token_from_login(self,
            self.admin_data["email"], self.admin_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        url = f"{self.url}/{self.course_technology.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Technology.objects.filter(slug="typescript").exists())

    def test_delete_course_technology_regular_user(self):
        token = get_jwt_token_from_login(self,
            self.regular_user_data["email"], self.regular_user_data["password"]
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        url = f"{self.url}/{self.course_technology.id}"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class FeaturedTechnologiesViewTest(APITestCase):
    def setUp(self):
        self.url = f"/{Urls.API}/{Urls.FEATURED_TECHNOLOGIES}"
        # Create technologies
        self.technology_python = Technology.objects.create(slug="python", name="Python")
        self.technology_javascript = Technology.objects.create(slug="javascript", name="JavaScript")

        self.level = Level.objects.create(slug="level")
        self.category = Category.objects.create(slug="category")
        
        # Create courses for Python
        self.course_python = Course.objects.create(
            slug="python-course", 
            technology=self.technology_python, 
            level=self.level, 
            category=self.category,
            duration=10, 
            chat_url="http://example.com/chat", 
            active=True
        )
        
        # Create courses for JavaScript
        self.course_js = Course.objects.create(
            slug="js-course", 
            technology=self.technology_javascript, 
            level=self.level, 
            category=self.category,
            duration=10, 
            chat_url="http://example.com/chat", 
            active=True
        )

        self.student_1 = Student.objects.create(user=get_user_model().objects.create_user(
            username=get_unique_username("student1@example.com"),
            email="student1@example.com",
            password="password",
            user_type=UserType.STUDENT,
            is_active=True,
        ))
        self.student_2 = Student.objects.create(user=get_user_model().objects.create_user(
            username=get_unique_username("student2@example.com"),
            email="student2@example.com",
            password="password",
            user_type=UserType.STUDENT,
            is_active=True,
        ))
        self.student_3 = Student.objects.create(user=get_user_model().objects.create_user(
            username=get_unique_username("student3@example.com"),
            email="student3@example.com",
            password="password",
            user_type=UserType.STUDENT,
            is_active=True,
        ))


        # Enroll users in courses
        CourseEnrollment.objects.create(course=self.course_python, student=self.student_1)
        CourseEnrollment.objects.create(course=self.course_js, student=self.student_2)

        # Add reviews for Python course
        Review.objects.create(course=self.course_python, rating=5, student=self.student_1)
        Review.objects.create(course=self.course_python, rating=4, student=self.student_2)

        # Add reviews for JavaScript course
        Review.objects.create(course=self.course_js, rating=4, student=self.student_2)
        Review.objects.create(course=self.course_js, rating=3, student=self.student_3)

    def test_get_featured_technologies(self):
        # Call the API endpoint
        response = self.client.get(self.url)
        
        # Check the status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check if the response data is a list
        self.assertIsInstance(response.data, list)
        
        # Check the number of technologies returned (should be 2 here)
        self.assertEqual(len(response.data), 2)
        
        # Check the technology names and slugs
        self.assertEqual(response.data[0]["slug"], "python")
        self.assertEqual(response.data[0]["name"], "Python")
        
        self.assertEqual(response.data[1]["slug"], "javascript")
        self.assertEqual(response.data[1]["name"], "JavaScript")

    def test_featured_technologies_order_by_enrollments_and_rating(self):
        # Ensure that technologies are ordered by total enrollments and average rating
        response = self.client.get(self.url)

        # First technology should be Python due to higher enrollments and average rating
        self.assertEqual(response.data[0]["slug"], "python")
        self.assertEqual(response.data[1]["slug"], "javascript")