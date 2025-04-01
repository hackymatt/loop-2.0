from rest_framework import serializers
from django.db.models import Sum
from .models import Course, CourseTranslation, Teacher
from .level.serializers import LevelSerializer
from .category.serializers import CategorySerializer
from .technology.serializers import TechnologySerializer

class TeacherSerializer(serializers.ModelSerializer):
    """Serializer for teachers"""
    class Meta:
        model = Teacher
        fields = ["id", "first_name", "last_name", "email"]  # Adjust as needed


class CourseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)  # Used for input
    language = serializers.CharField(write_only=True)  # Used for input
    translated_name = serializers.SerializerMethodField()  # Used for output
    level = LevelSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    technology = TechnologySerializer(read_only=True)
    teachers = TeacherSerializer(many=True, read_only=True)  # FIXED
    points = serializers.SerializerMethodField()  # Sum lesson points

    class Meta:
        model = Course
        fields = [
            "slug",
            "name",
            "language",
            "translated_name",
            "level",
            "category",
            "technology",
            "teachers",
            "duration",
            "chat_url",
            "points",
        ]

    def get_translated_name(self, obj):
        """Retrieve the translated name based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.name if translation else None

    def get_points(self, obj):
        """Calculate total points from lessons in all chapters of the course"""
        return 0

    def create(self, validated_data):
        slug = validated_data["slug"]
        language = validated_data["language"]
        name = validated_data["name"]

        # Get or create course
        course, _ = Course.objects.get_or_create(slug=slug)

        # Create or update translation
        CourseTranslation.objects.update_or_create(
            course=course, language=language, defaults={"name": name}
        )

        return course

    def update(self, instance, validated_data):
        language = validated_data.get("language")
        name = validated_data.get("name")

        if language and name:
            # Update or create translation
            CourseTranslation.objects.update_or_create(
                course=instance, language=language, defaults={"name": name}
            )

        return instance
