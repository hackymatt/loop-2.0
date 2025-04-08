from django.test import TestCase
from django.db.models import Avg, Count
from rest_framework.test import APIClient
from rest_framework import status
from review.models import Review
from course.models import Course
from course.enrollment.models import CourseEnrollment
from ..factory import create_student, create_course
from const import Urls, Language


class CourseViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.COURSE}"

        self.student_1, _ = create_student()
        self.student_2, _ = create_student()

        self.course_1, self.course_1_translations = create_course()
        self.course_2, self.course_2_translations = create_course()

        self.review_1 = Review.objects.create(
            student=self.student_1,
            course=self.course_1,
            rating=5,
            language=Language.EN,
            comment="Great course!",
        )
        self.review_2 = Review.objects.create(
            student=self.student_2,
            course=self.course_1,
            rating=4,
            language=Language.EN,
            comment="Good course!",
        )
        self.review_3 = Review.objects.create(
            student=self.student_2,
            course=self.course_2,
            rating=3,
            language=Language.EN,
            comment="Good course!",
        )

    def test_list_courses(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(
            response.data["results"][0]["translated_name"],
            self.course_1_translations["en"].name,
        )

    def test_retrieve_course_by_slug(self):
        response = self.client.get(f"{self.url}/{self.course_1.slug}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], self.course_1.slug)
        self.assertEqual(
            response.data["translated_overview"],
            self.course_1_translations["en"].overview,
        )

    def test_filter_courses_by_technology(self):
        response = self.client.get(
            f"{self.url}?technologies={self.course_1.technology.slug}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["slug"], self.course_1.slug)

    def test_filter_courses_by_minimum_rating(self):
        response = self.client.get(f"{self.url}?rating=4")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        returned_slugs = [course["slug"] for course in response.data["results"]]
        self.assertIn(self.course_1.slug, returned_slugs)
        self.assertNotIn(self.course_2.slug, returned_slugs)


class FeaturedCoursesViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.FEATURED_COURSE}"

        self.student_1, _ = create_student()
        self.student_2, _ = create_student()

        # Create 7 courses with varying ratings, enrollments, and created_at
        self.courses = []
        for i in range(7):
            course, _ = create_course()
            self.courses.append(course)

        # Ratings
        Review.objects.create(course=self.courses[3], rating=5, student=self.student_1)
        Review.objects.create(course=self.courses[2], rating=4, student=self.student_1)
        Review.objects.create(course=self.courses[2], rating=2, student=self.student_2)

        # Enrollments
        CourseEnrollment.objects.create(course=self.courses[2], student=self.student_1)
        CourseEnrollment.objects.create(course=self.courses[2], student=self.student_2)
        CourseEnrollment.objects.create(course=self.courses[3], student=self.student_1)

    def test_view_returns_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_view_returns_max_6_unique_courses(self):
        response = self.client.get(self.url)
        self.assertLessEqual(len(response.data), 6)

    def test_courses_include_best_rated(self):
        response = self.client.get(self.url)
        returned_slugs = {course["slug"] for course in response.data}
        best_rated = (
            Course.objects.annotate(avg_rating=Avg("reviews__rating"))
            .filter(avg_rating__isnull=False)
            .order_by("-avg_rating")[:5]
        )

        self.assertTrue(
            any(course.slug in returned_slugs for course in best_rated),
            "None of the best-rated courses were included in the featured courses.",
        )

    def test_courses_include_most_enrolled(self):
        response = self.client.get(self.url)
        returned_slugs = {course["slug"] for course in response.data}
        most_enrolled = Course.objects.annotate(
            enrollment_count=Count("enrollments")
        ).order_by("-enrollment_count")[:5]

        self.assertTrue(
            any(course.slug in returned_slugs for course in most_enrolled),
            "None of the most-enrolled courses were included in the featured courses.",
        )

    def test_courses_include_newest(self):
        response = self.client.get(self.url)
        returned_slugs = {course["slug"] for course in response.data}
        newest = Course.objects.order_by("-created_at")[:5]

        # At least one of the newest courses should be in the result
        self.assertTrue(
            any(course.slug in returned_slugs for course in newest),
            "None of the newest courses were included in the featured courses.",
        )

    def test_courses_are_deduplicated(self):
        # This checks that the result is truly deduplicated
        response = self.client.get(self.url)
        returned_slugs = [course["slug"] for course in response.data]
        self.assertEqual(len(returned_slugs), len(set(returned_slugs)))


class SimilarCoursesViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.SIMILAR_COURSES}"

        # Create a base course
        self.base_course, _ = create_course()

        # Create similar courses (matching at least one attribute)
        self.similar_1, _ = create_course()
        self.similar_1.category = self.base_course.category
        self.similar_1.save()

        self.similar_2, _ = create_course()
        self.similar_2.technology = self.base_course.technology
        self.similar_2.save()

        self.similar_3, _ = create_course()
        self.similar_3.level = self.base_course.level
        self.similar_3.save()

        # Course that should not be returned
        self.unrelated, _ = create_course()

    def test_view_returns_success(self):
        response = self.client.get(
            self.url.replace("<slug:slug>", self.base_course.slug)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_similar_courses_are_returned(self):
        response = self.client.get(
            self.url.replace("<slug:slug>", self.base_course.slug)
        )
        returned_slugs = {course["slug"] for course in response.data}

        # All returned courses should match at least one attribute
        for course_slug in returned_slugs:
            course = Course.objects.get(slug=course_slug)
            self.assertTrue(
                course.category == self.base_course.category
                or course.technology == self.base_course.technology
                or course.level == self.base_course.level
            )

        # The unrelated course should not be in the results
        self.assertNotIn(self.unrelated.slug, returned_slugs)

    def test_base_course_is_excluded(self):
        response = self.client.get(
            self.url.replace("<slug:slug>", self.base_course.slug)
        )
        returned_slugs = {course["slug"] for course in response.data}
        self.assertNotIn(self.base_course.slug, returned_slugs)

    def test_returns_at_most_three_courses(self):
        response = self.client.get(
            self.url.replace("<slug:slug>", self.base_course.slug)
        )
        self.assertLessEqual(len(response.data), 3)

    def test_returns_empty_if_no_similar(self):
        # Create a course with a unique category, tech, and level
        unique_course, _ = create_course()
        response = self.client.get(self.url.replace("<slug:slug>", unique_course.slug))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
