from rest_framework import serializers
from django.db.models import Sum, Count, Q
from .models import Course, CourseTranslation
from .level.serializers import LevelSerializer
from .category.serializers import CategorySerializer
from .technology.serializers import TechnologySerializer
from user.type.instructor_user.serializers import InstructorSerializer
from const import LessonType


class CourseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)  # Used for input
    language = serializers.CharField(write_only=True)  # Used for input
    translated_name = serializers.SerializerMethodField()  # Used for output
    level = LevelSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    technology = TechnologySerializer(read_only=True)
    instructors = InstructorSerializer(many=True, read_only=True)
    points = serializers.SerializerMethodField()  # Sum lesson points
    readings = serializers.SerializerMethodField()  # Sum lesson points
    videos = serializers.SerializerMethodField()  # Sum lesson points
    quizzes = serializers.SerializerMethodField()  # Sum lesson points
    codings = serializers.SerializerMethodField()  # Sum lesson points

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
            "instructors",
            "duration",
            "chat_url",
            "points",
            "readings",
            "videos",
            "quizzes",
            "codings",
        ]

    def get_translated_name(self, obj):
        """Retrieve the translated name based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.name if translation else None

    def get_points(self, obj):
        """Calculate total points from lessons in all chapters of the course"""
        return obj.chapters.aggregate(Sum("lessons__points"))["lessons__points__sum"] or 0
    
    def get_readings(self, obj):
        """Count the number of reading lessons in all chapters of the course"""
        return obj.chapters.aggregate(
            total_readings=Count("lessons", filter=Q(lessons__type=LessonType.READING))
        )["total_readings"] or 0

    def get_videos(self, obj):
        """Count the number of video lessons in all chapters of the course"""
        return obj.chapters.aggregate(
            total_videos=Count("lessons", filter=Q(lessons__type=LessonType.VIDEO))
        )["total_videos"] or 0

    def get_quizzes(self, obj):
        """Count the number of quiz lessons in all chapters of the course"""
        return obj.chapters.aggregate(
            total_quizzes=Count("lessons", filter=Q(lessons__type=LessonType.QUIZ))
        )["total_quizzes"] or 0

    def get_codings(self, obj):
        """Count the number of coding lessons in all chapters of the course"""
        return obj.chapters.aggregate(
            total_codings=Count("lessons", filter=Q(lessons__type=LessonType.CODING))
        )["total_codings"] or 0

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
