import math
import re
import markdown
from bs4 import BeautifulSoup
from rest_framework import serializers
from django.utils.translation import gettext as _
from .models import (
    Lesson,
    ReadingLesson,
    ReadingLessonTranslation,
    VideoLesson,
    VideoLessonTranslation,
    QuizLesson,
    QuizLessonTranslation,
    QuizQuestion,
    QuizQuestionOption,
    CodingLesson,
    CodingLessonTranslation,
)
from ..progress.models import CourseProgress
from const import LessonType, UserType
from global_config import CONFIG


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


class ReadingLessonSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="lesson.type")
    points = serializers.CharField(source="lesson.points")
    name = serializers.SerializerMethodField()
    text = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = ReadingLesson
        fields = ["type", "points", "name", "text", "duration"]

    def get_name(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).name

    def get_text(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).text

    def get_duration(self, obj):
        content = self.get_text(obj)
        html = markdown.markdown(content)

        # Strip HTML tags
        soup = BeautifulSoup(html, features="html.parser")
        plain_text = soup.get_text()

        # Count words
        words = re.findall(r"\w+", plain_text)
        return math.ceil(
            len(words) / CONFIG["words_per_minute"]
        )  # Assuming 200 words per minute


class VideoLessonSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="lesson.type")
    points = serializers.CharField(source="lesson.points")
    video_url = serializers.URLField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = VideoLesson
        fields = ["type", "points", "name", "video_url"]

    def get_name(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).name


class QuizQuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestionOption
        fields = ["text"]


class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizQuestionOptionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = ["text", "options"]


class QuizLessonSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="lesson.type")
    points = serializers.CharField(source="lesson.points")
    name = serializers.SerializerMethodField()
    question = serializers.SerializerMethodField()

    class Meta:
        model = QuizLesson
        fields = ["type", "points", "name", "quiz_type", "question"]

    def get_name(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).name

    def get_question(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        question = obj.get_translation(lang).question
        return QuizQuestionSerializer(question).data

    def to_representation(self, instance):
        data = super().to_representation(instance)

        user = self.context["request"].user
        progress = CourseProgress.objects.filter(
            student__user=user, lesson=instance.lesson, completed_at__isnull=False
        )
        if progress.exists():
            data["answer"] = progress.first().answer

        return data


class CodingLessonSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="lesson.type")
    points = serializers.CharField(source="lesson.points")
    name = serializers.SerializerMethodField()
    technology = serializers.CharField(source="technology.slug", read_only=True)
    starter_code = serializers.CharField(read_only=True)
    penalty_points = serializers.IntegerField(read_only=True)
    introduction = serializers.SerializerMethodField()
    instructions = serializers.SerializerMethodField()

    class Meta:
        model = CodingLesson
        fields = [
            "type",
            "points",
            "file_name",
            "name",
            "technology",
            "starter_code",
            "penalty_points",
            "introduction",
            "instructions",
        ]

    def get_name(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).name

    def get_introduction(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).introduction

    def get_instructions(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).instructions

    def to_representation(self, instance):
        lang = self.context.get("request").LANGUAGE_CODE
        data = super().to_representation(instance)

        request = self.context["request"]
        user = request.user

        progress = CourseProgress.objects.filter(
            student__user=user,
            lesson=instance.lesson,
        ).first()

        if progress.hint_used:
            data["hint"] = instance.get_translation(lang).hint

        if progress.completed_at:
            data["answer"] = progress.answer

        return data


class QuizLessonSubmitSerializer(serializers.Serializer):
    answer = serializers.ListField(child=serializers.JSONField(), allow_empty=False)

    def validate(self, attrs):
        lang = self.context.get("request").LANGUAGE_CODE
        lesson = self.context.get("lesson")
        answer = attrs["answer"]

        question = lesson.get_translation(lang).question
        correct = [option.is_correct for option in question.options.all()]

        if answer != correct:
            raise serializers.ValidationError(
                {
                    "answer": [
                        _("Almost there! Review your answers and give it another shot.")
                    ]
                }
            )

        return attrs


class CodingLessonSubmitSerializer(serializers.Serializer):
    answer = serializers.CharField()

    def validate(self, attrs):
        lesson = self.context.get("lesson")
        answer = attrs["answer"]

        correct = lesson.solution_code

        if answer != correct:
            raise serializers.ValidationError(
                {
                    "answer": [
                        _("Almost there! Check your code and give it another shot.")
                    ]
                }
            )

        return attrs
