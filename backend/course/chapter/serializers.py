from rest_framework import serializers
from .models import Chapter
from ..lesson.serializers import LessonSerializer  # Import Lesson serializer if available


class ChapterSerializer(serializers.ModelSerializer):
    translated_name = serializers.SerializerMethodField()  # Used for output
    translated_description = serializers.SerializerMethodField()  # Used for output
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = ["slug", "translated_name", "translated_description", "lessons"]

    def get_translated_name(self, obj):
        """Retrieve the translated name based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.name if translation else ""

    def get_translated_description(self, obj):
        """Retrieve the translated description based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.description if translation else ""

    def get_lessons(self, obj):
        return LessonSerializer(obj.lessons.all(), many=True, context=self.context).data