from rest_framework import serializers
from django.db.models import Sum, Count, Avg, Q
from .models import Course, CourseTranslation
from .level.serializers import LevelSerializer
from .category.serializers import CategorySerializer
from .technology.serializers import TechnologySerializer
from .enrollment.models import CourseEnrollment
from .chapter.serializers import ChapterSerializer
from user.type.instructor_user.serializers import InstructorSerializer
from review.models import Review
from const import LessonType


class BaseCourseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    language = serializers.CharField(write_only=True)
    translated_name = serializers.SerializerMethodField()
    translated_description = serializers.SerializerMethodField()
    level = LevelSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    technology = TechnologySerializer(read_only=True)
    instructors = InstructorSerializer(many=True, read_only=True)
    lessons_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    ratings_count = serializers.SerializerMethodField()
    students_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "slug", "name", "language", "translated_name", "translated_description",
            "level", "category", "technology", "instructors", "duration",
            "lessons_count", "average_rating", "ratings_count", "students_count"
        ]

    def _get_translation(self, obj, field):
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return getattr(translation, field, None) if translation else None

    def get_translated_name(self, obj):
        return self._get_translation(obj, "name")

    def get_translated_description(self, obj):
        return self._get_translation(obj, "description")

    def get_lessons_count(self, obj):
        return obj.chapters.aggregate(total_lessons=Count("lessons"))["total_lessons"] or 0

    def get_average_rating(self, obj):
        avg_rating = Review.objects.filter(course=obj).aggregate(Avg("rating"))["rating__avg"]
        return round(avg_rating, 1) if avg_rating else None

    def get_ratings_count(self, obj):
        return Review.objects.filter(course=obj).count()

    def get_students_count(self, obj):
        return CourseEnrollment.objects.filter(course=obj).count()


class CourseListSerializer(BaseCourseSerializer):
    pass


class CourseRetrieveSerializer(BaseCourseSerializer):
    translated_overview = serializers.SerializerMethodField()
    chat_url = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    reading_count = serializers.SerializerMethodField()
    video_count = serializers.SerializerMethodField()
    quiz_count = serializers.SerializerMethodField()
    coding_count = serializers.SerializerMethodField()
    chapters = serializers.SerializerMethodField()

    class Meta(BaseCourseSerializer.Meta):
        fields = BaseCourseSerializer.Meta.fields + [
            "translated_overview", "chat_url", "points", "reading_count", "video_count",
            "quiz_count", "coding_count", "chapters"
        ]

    def get_translated_overview(self, obj):
        return self._get_translation(obj, "overview")

    def get_chat_url(self, obj):
        return None

    def get_points(self, obj):
        return obj.chapters.aggregate(Sum("lessons__points"))["lessons__points__sum"] or 0

    def get_lesson_count_by_type(self, obj, lesson_type):
        return obj.chapters.aggregate(
            total=Count("lessons", filter=Q(lessons__type=lesson_type))
        )["total"] or 0

    def get_reading_count(self, obj):
        return self.get_lesson_count_by_type(obj, LessonType.READING)

    def get_video_count(self, obj):
        return self.get_lesson_count_by_type(obj, LessonType.VIDEO)

    def get_quiz_count(self, obj):
        return self.get_lesson_count_by_type(obj, LessonType.QUIZ)

    def get_coding_count(self, obj):
        return self.get_lesson_count_by_type(obj, LessonType.CODING)
    
    def get_chapters(self, obj):
        return ChapterSerializer(obj.chapters.all(), many=True, context=self.context).data

    def create(self, validated_data):
        course, _ = Course.objects.get_or_create(slug=validated_data["slug"])
        CourseTranslation.objects.update_or_create(
            course=course, language=validated_data["language"],
            defaults={"name": validated_data["name"]}
        )
        return course

    def update(self, instance, validated_data):
        if "language" in validated_data and "name" in validated_data:
            CourseTranslation.objects.update_or_create(
                course=instance, language=validated_data["language"],
                defaults={"name": validated_data["name"]}
            )
        return instance
