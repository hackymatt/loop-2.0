from rest_framework import serializers
from .models import (
    Lesson,
    ReadingLessonTranslation,
    VideoLessonTranslation,
    QuizLessonTranslation,
    CodingLessonTranslation,
)
from ..progress.models import CourseProgress
from const import LessonType, UserType


class LessonSerializer(serializers.ModelSerializer):
    translated_name = serializers.SerializerMethodField()  # Used for output

    class Meta:
        model = Lesson
        fields = ["slug", "translated_name", "points", "type"]

    def get_translated_name(self, obj):
        """Retrieve the translated name based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        if obj.type == LessonType.READING:
            translation = ReadingLessonTranslation.objects.filter(
                lesson=obj.reading, language=lang
            ).first()
        elif obj.type == LessonType.VIDEO:
            translation = VideoLessonTranslation.objects.filter(
                lesson=obj.video, language=lang
            ).first()
        elif obj.type == LessonType.QUIZ:
            translation = QuizLessonTranslation.objects.filter(
                lesson=obj.quiz, language=lang
            ).first()
        else:
            translation = CodingLessonTranslation.objects.filter(
                lesson=obj.coding, language=lang
            ).first()
        return translation.name

    def to_representation(self, instance):
        data = super().to_representation(instance)

        user = self.context["request"].user
        if not user.is_authenticated or user.user_type != UserType.STUDENT:
            return data

        progress = self.get_progress(instance, user)
        data["progress"] = progress
        data["earned_points"] = (
            self.get_points(instance, user) if progress == 100 else None
        )

        return data

    def get_progress(self, obj, user):
        is_completed = CourseProgress.objects.filter(
            student__user=user, lesson=obj, completed_at__isnull=False
        ).exists()

        return 100 if is_completed else 0

    def get_points(self, obj, user):
        return (
            CourseProgress.objects.filter(
                student__user=user, lesson=obj, completed_at__isnull=False
            )
            .first()
            .points
        )
