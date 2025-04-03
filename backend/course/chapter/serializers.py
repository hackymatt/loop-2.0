from rest_framework import serializers
from .models import Chapter
from ..lesson.serializers import LessonSerializer  # Import Lesson serializer if available


class ChapterSerializer(serializers.ModelSerializer):
    translated_name = serializers.SerializerMethodField()  # Used for output
    translated_description = serializers.SerializerMethodField()  # Used for output
    lessons = LessonSerializer(many=True)  # Serialize related lessons

    class Meta:
        model = Chapter
        fields = ["slug", "translated_name", "translated_description", "lessons"]

    def get_translated_name(self, obj):
        """Retrieve the translated name based on request language"""
        request = self.context.get("request")
        language = request.GET.get("lang", "en")  # Default to English if no lang is provided
        translation = obj.translations.filter(language=language).first()
        return translation.name if translation else ""

    def get_translated_description(self, obj):
        """Retrieve the translated description based on request language"""
        request = self.context.get("request")
        language = request.GET.get("lang", "en")
        translation = obj.translations.filter(language=language).first()
        return translation.description if translation else ""
