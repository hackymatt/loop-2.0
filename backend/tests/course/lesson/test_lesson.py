from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from course.enrollment.models import CourseEnrollment
from course.progress.models import CourseProgress
from ...factory import create_student, create_course, create_lesson
from ...helpers import login
from const import Urls, LessonType


class LessonViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.LESSON}"

        self.student, self.student_password = create_student()

        self.course = create_course()
        chapter = self.course.chapters.all()[0]

        self.reading_lesson, self.reading_specific_lesson = create_lesson(
            LessonType.READING
        )
        self.video_lesson, self.video_specific_lesson = create_lesson(LessonType.VIDEO)
        self.quiz_lesson, self.quiz_specific_lesson = create_lesson(LessonType.QUIZ)
        self.coding_lesson, self.coding_specific_lesson = create_lesson(
            LessonType.CODING
        )
        chapter.lessons.add(self.reading_lesson)
        chapter.lessons.add(self.video_lesson)
        chapter.lessons.add(self.quiz_lesson)
        chapter.lessons.add(self.coding_lesson)
        chapter.save()

    def test_requires_authentication(self):
        response = self.client.get(
            self.url.replace("<slug:course_slug>", self.course.slug).replace(
                "<slug:lesson_slug>", self.reading_lesson.slug
            )
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_successful_retrieve_reading_lesson(self):
        login(self, self.student.user.email, self.student_password)
        response = self.client.get(
            self.url.replace("<slug:course_slug>", self.course.slug).replace(
                "<slug:lesson_slug>", self.reading_lesson.slug
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("type", response.data)
        self.assertIn("points", response.data)
        self.assertIn("name", response.data)
        self.assertIn("text", response.data)

        # Ensure progress and enrollment were created
        self.assertTrue(
            CourseEnrollment.objects.filter(
                student=self.student, course=self.course
            ).exists()
        )
        self.assertTrue(
            CourseProgress.objects.filter(
                student=self.student, lesson=self.reading_lesson
            ).exists()
        )

    def test_successful_retrieve_video_lesson(self):
        login(self, self.student.user.email, self.student_password)
        response = self.client.get(
            self.url.replace("<slug:course_slug>", self.course.slug).replace(
                "<slug:lesson_slug>", self.video_lesson.slug
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("type", response.data)
        self.assertIn("points", response.data)
        self.assertIn("name", response.data)
        self.assertIn("video_url", response.data)

        # Ensure progress and enrollment were created
        self.assertTrue(
            CourseEnrollment.objects.filter(
                student=self.student, course=self.course
            ).exists()
        )
        self.assertTrue(
            CourseProgress.objects.filter(
                student=self.student, lesson=self.video_lesson
            ).exists()
        )

    def test_successful_retrieve_quiz_lesson_not_completed(self):
        login(self, self.student.user.email, self.student_password)
        response = self.client.get(
            self.url.replace("<slug:course_slug>", self.course.slug).replace(
                "<slug:lesson_slug>", self.quiz_lesson.slug
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("type", response.data)
        self.assertIn("points", response.data)
        self.assertIn("name", response.data)
        self.assertIn("question", response.data)

        # Ensure progress and enrollment were created
        self.assertTrue(
            CourseEnrollment.objects.filter(
                student=self.student, course=self.course
            ).exists()
        )
        self.assertTrue(
            CourseProgress.objects.filter(
                student=self.student, lesson=self.quiz_lesson
            ).exists()
        )

    def test_successful_retrieve_quiz_lesson_completed(self):
        login(self, self.student.user.email, self.student_password)
        CourseProgress.objects.create(
            student=self.student, lesson=self.quiz_lesson, completed_at=timezone.now()
        )
        response = self.client.get(
            self.url.replace("<slug:course_slug>", self.course.slug).replace(
                "<slug:lesson_slug>", self.quiz_lesson.slug
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("type", response.data)
        self.assertIn("points", response.data)
        self.assertIn("name", response.data)
        self.assertIn("question", response.data)
        self.assertIn("answer", response.data)

        # Ensure progress and enrollment were created
        self.assertTrue(
            CourseEnrollment.objects.filter(
                student=self.student, course=self.course
            ).exists()
        )
        self.assertTrue(
            CourseProgress.objects.filter(
                student=self.student, lesson=self.quiz_lesson
            ).exists()
        )

    def test_successful_retrieve_coding_lesson_not_completed(self):
        login(self, self.student.user.email, self.student_password)
        response = self.client.get(
            self.url.replace("<slug:course_slug>", self.course.slug).replace(
                "<slug:lesson_slug>", self.coding_lesson.slug
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("type", response.data)
        self.assertIn("points", response.data)
        self.assertIn("name", response.data)
        self.assertIn("introduction", response.data)
        self.assertIn("instructions", response.data)
        self.assertIn("technology", response.data)
        self.assertIn("starter_code", response.data)
        self.assertIn("penalty_points", response.data)

        # Ensure progress and enrollment were created
        self.assertTrue(
            CourseEnrollment.objects.filter(
                student=self.student, course=self.course
            ).exists()
        )
        self.assertTrue(
            CourseProgress.objects.filter(
                student=self.student, lesson=self.coding_lesson
            ).exists()
        )

    def test_successful_retrieve_coding_lesson_completed(self):
        login(self, self.student.user.email, self.student_password)
        CourseProgress.objects.create(
            student=self.student, lesson=self.coding_lesson, completed_at=timezone.now()
        )
        response = self.client.get(
            self.url.replace("<slug:course_slug>", self.course.slug).replace(
                "<slug:lesson_slug>", self.coding_lesson.slug
            )
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("type", response.data)
        self.assertIn("points", response.data)
        self.assertIn("name", response.data)
        self.assertIn("introduction", response.data)
        self.assertIn("instructions", response.data)
        self.assertIn("technology", response.data)
        self.assertIn("starter_code", response.data)
        self.assertIn("penalty_points", response.data)

        # Ensure progress and enrollment were created
        self.assertTrue(
            CourseEnrollment.objects.filter(
                student=self.student, course=self.course
            ).exists()
        )
        self.assertTrue(
            CourseProgress.objects.filter(
                student=self.student, lesson=self.coding_lesson
            ).exists()
        )

    def test_course_not_found(self):
        login(self, self.student.user.email, self.student_password)
        response = self.client.get(
            self.url.replace("<slug:course_slug>", "aaadddd").replace(
                "<slug:lesson_slug>", self.reading_lesson.slug
            )
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_lesson_not_found_in_course(self):
        # Create a lesson that's not part of the course
        other_course = create_course()

        login(self, self.student.user.email, self.student_password)
        response = self.client.get(
            self.url.replace("<slug:course_slug>", other_course.slug).replace(
                "<slug:lesson_slug>", self.reading_lesson.slug
            )
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class LessonSubmitAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.LESSON_SUBMIT}"

        self.student, self.student_password = create_student()

        self.course = create_course()
        chapter = self.course.chapters.all()[0]
        self.lesson = chapter.lessons.all()[0]

        self.reading_lesson, self.reading_specific_lesson = create_lesson(
            LessonType.READING
        )
        self.quiz_lesson, self.quiz_specific_lesson = create_lesson(LessonType.QUIZ)
        self.coding_lesson, self.coding_specific_lesson = create_lesson(
            LessonType.CODING
        )
        chapter.lessons.add(self.quiz_lesson)
        chapter.lessons.add(self.coding_lesson)
        chapter.save()

    def test_requires_authentication(self):
        response = self.client.post(self.url, data={})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_successful_quiz_submission(self):
        login(self, self.student.user.email, self.student_password)
        question = self.quiz_specific_lesson.get_translation("en").question
        answer = [option.is_correct for option in question.options.all()]
        data = {"lesson": self.quiz_lesson.slug, "answer": answer}
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        progress = CourseProgress.objects.get(
            student=self.student, lesson=self.quiz_lesson
        )
        self.assertIsNotNone(progress.completed_at)
        self.assertEqual(progress.answer, answer)

    def test_invalid_quiz_submission(self):
        login(self, self.student.user.email, self.student_password)
        question = self.quiz_specific_lesson.get_translation("en").question
        answer = [not option.is_correct for option in question.options.all()]
        data = {"lesson": self.quiz_lesson.slug, "answer": answer}
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_successful_coding_submission(self):
        login(self, self.student.user.email, self.student_password)
        answer = self.coding_specific_lesson.solution_code
        data = {"lesson": self.coding_lesson.slug, "answer": answer}
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        progress = CourseProgress.objects.get(
            student=self.student, lesson=self.coding_lesson
        )
        self.assertIsNotNone(progress.completed_at)
        self.assertEqual(progress.answer, answer)

    def test_invalid_coding_submission(self):
        login(self, self.student.user.email, self.student_password)
        answer = "incorrect"
        data = {"lesson": self.coding_lesson.slug, "answer": answer}
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_successful_other_submission(self):
        login(self, self.student.user.email, self.student_password)
        data = {
            "lesson": self.reading_lesson.slug,
        }
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        progress = CourseProgress.objects.get(
            student=self.student, lesson=self.reading_lesson
        )
        self.assertIsNotNone(progress.completed_at)

    def test_lesson_not_found(self):
        login(self, self.student.user.email, self.student_password)
        data = {
            "lesson": "incorrect",
        }
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class LessonAnswerAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = f"/{Urls.API}/{Urls.LESSON_ANSWER}"

        self.student, self.student_password = create_student()

        self.course = create_course()
        chapter = self.course.chapters.all()[0]
        self.lesson = chapter.lessons.all()[0]

        self.reading_lesson, self.reading_specific_lesson = create_lesson(
            LessonType.READING
        )
        self.quiz_lesson, self.quiz_specific_lesson = create_lesson(LessonType.QUIZ)
        self.coding_lesson, self.coding_specific_lesson = create_lesson(
            LessonType.CODING
        )
        chapter.lessons.add(self.quiz_lesson)
        chapter.lessons.add(self.coding_lesson)
        chapter.save()

    def test_quiz_lesson_answer_retrieval(self):
        login(self, self.student.user.email, self.student_password)
        question = self.quiz_specific_lesson.get_translation("en").question
        answer = [option.is_correct for option in question.options.all()]
        response = self.client.post(
            self.url, data={"lesson": self.quiz_lesson.slug}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["answer"], answer)

        progress = CourseProgress.objects.get(
            student=self.student, lesson=self.quiz_lesson
        )
        self.assertIsNotNone(progress.completed_at)
        self.assertEqual(progress.answer, answer)
        self.assertEqual(progress.points, 0)

    def test_coding_lesson_answer_retrieval(self):
        login(self, self.student.user.email, self.student_password)
        answer = self.coding_specific_lesson.solution_code
        response = self.client.post(
            self.url, data={"lesson": self.coding_lesson.slug}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["answer"], answer)

        progress = CourseProgress.objects.get(
            student=self.student, lesson=self.coding_lesson
        )
        self.assertEqual(progress.answer, answer)

    def test_other_lesson_answer_retrieval(self):
        login(self, self.student.user.email, self.student_password)
        answer = None
        response = self.client.post(
            self.url, data={"lesson": self.reading_lesson.slug}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["answer"], answer)

        progress = CourseProgress.objects.get(
            student=self.student, lesson=self.reading_lesson
        )
        self.assertEqual(progress.answer, answer)

    def test_lesson_not_found(self):
        login(self, self.student.user.email, self.student_password)
        response = self.client.post(
            self.url, data={"lesson": "non-existent"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
