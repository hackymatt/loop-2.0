from rest_framework.mixins import RetrieveModelMixin
from rest_framework import status, views
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Lesson, ReadingLesson, VideoLesson, QuizLesson, CodingLesson
from .serializers import (
    ReadingLessonSerializer,
    VideoLessonSerializer,
    QuizLessonSerializer,
    CodingLessonSerializer,
    QuizLessonSubmitSerializer,
    CodingLessonSubmitSerializer,
)
from ..enrollment.models import CourseEnrollment
from ..progress.models import CourseProgress
from ..models import Course
from user.type.student_user.models import Student
from const import LessonType


class LessonViewSet(RetrieveModelMixin, GenericViewSet):
    queryset = Lesson.objects.select_related("reading", "video", "quiz", "coding")
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        course_slug = kwargs.get("course_slug")
        lesson_slug = kwargs.get("lesson_slug")

        student = Student.objects.get(user=request.user)

        # Get course and its chapters + lessons
        try:
            course = Course.objects.prefetch_related("chapters__lessons").get(
                slug=course_slug
            )
        except Course.DoesNotExist:
            return Response(
                {"root": "Course not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Find lesson within chapters
        lesson = None
        for chapter in course.chapters.all():
            lesson = chapter.lessons.filter(slug=lesson_slug).first()
            if lesson:
                break

        if not lesson:
            return Response(
                {"root": "Lesson not found in this course."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Ensure enrollment and progress exist
        CourseEnrollment.objects.get_or_create(student=student, course=course)
        CourseProgress.objects.get_or_create(
            student=student, lesson=lesson, defaults={"points": lesson.points}
        )

        # Get specific lesson object and serialize
        specific_model = {
            LessonType.READING: ReadingLesson,
            LessonType.VIDEO: VideoLesson,
            LessonType.QUIZ: QuizLesson,
            LessonType.CODING: CodingLesson,
        }.get(lesson.type)

        serializer_class = {
            LessonType.READING: ReadingLessonSerializer,
            LessonType.VIDEO: VideoLessonSerializer,
            LessonType.QUIZ: QuizLessonSerializer,
            LessonType.CODING: CodingLessonSerializer,
        }.get(lesson.type)

        specific_lesson = specific_model.objects.get(lesson=lesson)
        serializer = serializer_class(specific_lesson, context={"request": request})
        return Response(serializer.data)


class LessonSubmitAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        lesson_slug = request.data.pop("lesson")
        lesson = get_object_or_404(Lesson, slug=lesson_slug)

        specific_model = {
            LessonType.QUIZ: QuizLesson,
            LessonType.CODING: CodingLesson,
        }.get(lesson.type)

        serializer_class = {
            LessonType.QUIZ: QuizLessonSubmitSerializer,
            LessonType.CODING: CodingLessonSubmitSerializer,
        }.get(lesson.type)

        answer = None
        if serializer_class:
            specific_lesson = specific_model.objects.get(lesson=lesson)
            serializer = serializer_class(
                data=request.data,
                context={"lesson": specific_lesson, "request": request},
            )
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            answer = serializer.validated_data["answer"]

        # Save progress
        student = Student.objects.get(user=request.user)
        CourseProgress.objects.update_or_create(
            student=student,
            lesson=lesson,
            defaults={"answer": answer, "completed_at": timezone.now()},
        )

        return Response({}, status=status.HTTP_200_OK)


class LessonAnswerAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        lesson_slug = request.data.pop("lesson")
        lesson = get_object_or_404(Lesson, slug=lesson_slug)

        specific_model = {
            LessonType.QUIZ: QuizLesson,
            LessonType.CODING: CodingLesson,
        }.get(lesson.type)

        if lesson.type == LessonType.QUIZ:
            question = (
                specific_model.objects.get(lesson=lesson)
                .get_translation(request.LANGUAGE_CODE)
                .question
            )
            answer = [option.is_correct for option in question.options.all()]
        elif lesson.type == LessonType.CODING:
            answer = specific_model.objects.get(lesson=lesson).solution_code
        else:
            answer = None

        student = Student.objects.get(user=request.user)
        CourseProgress.objects.update_or_create(
            student=student,
            lesson=lesson,
            defaults={"answer": answer, "completed_at": timezone.now(), "points": 0},
        )

        return Response({"answer": answer}, status=status.HTTP_200_OK)
