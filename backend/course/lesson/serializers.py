from rest_framework import serializers
from .models import (
    Lesson,
    ReadingLessonTranslation,
    VideoLessonTranslation,
    QuizLessonTranslation,
    CodingLessonTranslation,
)
from const import LessonType


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
        elif obj.type == LessonType.CODING:
            translation = CodingLessonTranslation.objects.filter(
                lesson=obj.coding, language=lang
            ).first()
        else:
            translation = None
        return translation.name if translation else obj.slug
