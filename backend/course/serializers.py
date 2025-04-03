from rest_framework import serializers
from django.db.models import Sum, Count, Avg, Q
from .models import Course, CourseTranslation
from .level.serializers import LevelSerializer
from .category.serializers import CategorySerializer
from .technology.serializers import TechnologySerializer
from .enrollment.models import CourseEnrollment
from user.type.instructor_user.serializers import InstructorSerializer
from review.models import Review
from const import LessonType


class CourseListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)  # Used for input
    language = serializers.CharField(write_only=True)  # Used for input
    translated_name = serializers.SerializerMethodField()  # Used for output
    translated_description = serializers.SerializerMethodField()  # Used for output
    level = LevelSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    technology = TechnologySerializer(read_only=True)
    instructors = InstructorSerializer(many=True, read_only=True)
    lessons_count = serializers.SerializerMethodField()  # Total number of lessons
    average_rating = serializers.SerializerMethodField()  # Average rating of the course
    ratings_count = (
        serializers.SerializerMethodField()
    )  # Total number of ratings for the course
    students_count = serializers.SerializerMethodField()  # Number of students enrolled

    class Meta:
        model = Course
        fields = [
            "slug",
            "name",
            "language",
            "translated_name",
            "translated_description",
            "level",
            "category",
            "technology",
            "instructors",
            "duration",
            "lessons_count",
            "average_rating",
            "ratings_count",
            "students_count",
        ]

    def get_translated_name(self, obj):
        """Retrieve the translated name based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.name if translation else None

    def get_translated_description(self, obj):
        """Retrieve the translated description based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.description if translation else None

    def get_lessons_count(self, obj):
        """Calculate total number of lessons in all chapters of the course"""
        total_lessons = obj.chapters.aggregate(total_lessons=Count("lessons"))[
            "total_lessons"
        ]
        return total_lessons if total_lessons is not None else 0

    def get_average_rating(self, obj):
        """Calculate the average rating of the course"""
        avg_rating = Review.objects.filter(course=obj).aggregate(Avg("rating"))[
            "rating__avg"
        ]
        return round(avg_rating, 1) if avg_rating is not None else None

    def get_ratings_count(self, obj):
        """Count the total number of ratings for the course"""
        return Review.objects.filter(course=obj).count()

    def get_students_count(self, obj):
        """Count the total number of students enrolled in the course"""
        return CourseEnrollment.objects.filter(course=obj).count()


class CourseRetrieveSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)  # Used for input
    language = serializers.CharField(write_only=True)  # Used for input
    translated_name = serializers.SerializerMethodField()  # Used for output
    translated_description = serializers.SerializerMethodField()  # Used for output
    translated_overview = serializers.SerializerMethodField()  # Used for output
    level = LevelSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    technology = TechnologySerializer(read_only=True)
    instructors = InstructorSerializer(many=True, read_only=True)
    points = serializers.SerializerMethodField()  # Sum lesson points
    reading_count = serializers.SerializerMethodField()  # Sum reading lessons
    video_count = serializers.SerializerMethodField()  # Sum video lessons
    quiz_count = serializers.SerializerMethodField()  # Sum quiz lessons
    coding_count = serializers.SerializerMethodField()  # Sum coding lessons
    average_rating = serializers.SerializerMethodField()  # Average rating of the course
    ratings_count = (
        serializers.SerializerMethodField()
    )  # Total number of ratings for the course
    enrollments_count = (
        serializers.SerializerMethodField()
    )  # Number of students enrolled

    class Meta:
        model = Course
        fields = [
            "slug",
            "name",
            "language",
            "translated_name",
            "translated_description",
            "translated_overview",
            "level",
            "category",
            "technology",
            "instructors",
            "duration",
            "chat_url",
            "points",
            "reading_count",
            "video_count",
            "quiz_count",
            "coding_count",
            "average_rating",
            "ratings_count",
            "enrollments_count",
        ]

    def get_translated_name(self, obj):
        """Retrieve the translated name based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.name if translation else None

    def get_translated_description(self, obj):
        """Retrieve the translated description based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.description if translation else None

    def get_translated_overview(self, obj):
        """Retrieve the translated overview based on request language"""
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.overview if translation else None

    def get_points(self, obj):
        """Calculate total points from lessons in all chapters of the course"""
        return (
            obj.chapters.aggregate(Sum("lessons__points"))["lessons__points__sum"] or 0
        )

    def get_reading_count(self, obj):
        """Count the number of reading lessons in all chapters of the course"""
        return (
            obj.chapters.aggregate(
                total_readings=Count(
                    "lessons", filter=Q(lessons__type=LessonType.READING)
                )
            )["total_readings"]
            or 0
        )

    def get_video_count(self, obj):
        """Count the number of video lessons in all chapters of the course"""
        return (
            obj.chapters.aggregate(
                total_videos=Count("lessons", filter=Q(lessons__type=LessonType.VIDEO))
            )["total_videos"]
            or 0
        )

    def get_quiz_count(self, obj):
        """Count the number of quiz lessons in all chapters of the course"""
        return (
            obj.chapters.aggregate(
                total_quizzes=Count("lessons", filter=Q(lessons__type=LessonType.QUIZ))
            )["total_quizzes"]
            or 0
        )

    def get_coding_count(self, obj):
        """Count the number of coding lessons in all chapters of the course"""
        return (
            obj.chapters.aggregate(
                total_codings=Count(
                    "lessons", filter=Q(lessons__type=LessonType.CODING)
                )
            )["total_codings"]
            or 0
        )

    def get_average_rating(self, obj):
        """Calculate the average rating of the course"""
        avg_rating = Review.objects.filter(course=obj).aggregate(Avg("rating"))[
            "rating__avg"
        ]
        return round(avg_rating, 1) if avg_rating is not None else None

    def get_ratings_count(self, obj):
        """Count the total number of ratings for the course"""
        return Review.objects.filter(course=obj).count()

    def get_enrollments_count(self, obj):
        """Count the total number of students enrolled in the course"""
        return CourseEnrollment.objects.filter(course=obj).count()

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
