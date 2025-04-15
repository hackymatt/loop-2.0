from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from review.models import Review
from const import Language, Urls
from ..factory import create_student, create_course


class ReviewSummaryViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.COURSE_REVIEW_SUMMARY}"
        # Set up test data
        self.student_1, _ = create_student()
        self.student_2, _ = create_student()
        self.course = create_course()

        self.review_1 = Review.objects.create(
            student=self.student_1,
            course=self.course,
            rating=5,
            language=Language.EN,
            comment="Great course!",
        )
        self.review_2 = Review.objects.create(
            student=self.student_2,
            course=self.course,
            rating=4,
            language=Language.EN,
            comment="Good course!",
        )

    def test_review_summary(self):
        response = self.client.get(self.url.replace("<slug:slug>", self.course.slug))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Should return 2 different ratings
        self.assertEqual(response.data[0]["rating"], 4)
        self.assertEqual(response.data[1]["rating"], 5)

    def test_review_summary_course_not_found(self):
        response = self.client.get(self.url.replace("<slug:slug>", "abc"))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ReviewViewSetTest(TestCase):
    def setUp(self):
        self.url = f"/{Urls.API}/{Urls.COURSE_REVIEWS}"
        # Set up test data
        self.student_1, _ = create_student()
        self.student_2, _ = create_student()
        self.course = create_course()
        self.review_1 = Review.objects.create(
            student=self.student_1,
            course=self.course,
            rating=5,
            language=Language.EN,
            comment="Great course!",
        )
        self.review_2 = Review.objects.create(
            student=self.student_2,
            course=self.course,
            rating=4,
            language=Language.EN,
            comment="Good course!",
        )

    def test_review_list(self):
        response = self.client.get(self.url.replace("<slug:slug>", self.course.slug))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)  # Should return 2 reviews

    def test_review_list_course_not_found(self):
        response = self.client.get(self.url.replace("<slug:slug>", "abc"))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class FeaturedReviewsViewTest(TestCase):
    def setUp(self):
        self.url = f"/{Urls.API}/{Urls.FEATURED_REVIEWS}"
        # Set up test data
        self.student_1, _ = create_student()
        self.student_2, _ = create_student()
        self.course = create_course()
        self.review_1 = Review.objects.create(
            student=self.student_1,
            course=self.course,
            rating=5,
            language=Language.EN,
            comment="Great course!",
        )
        self.review_2 = Review.objects.create(
            student=self.student_2,
            course=self.course,
            rating=5,
            language=Language.EN,
            comment="Good course!",
        )

    def test_featured_reviews(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Should return 2 featured reviews

    def test_featured_reviews_filtered_by_language(self):
        # Simulate request for a different language
        self.client.defaults["HTTP_ACCEPT_LANGUAGE"] = "en"
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Should return 2 reviews in English

    def test_featured_reviews_no_reviews(self):
        # Create no featured reviews and test
        Review.objects.all().delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should return 0 reviews
