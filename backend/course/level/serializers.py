from rest_framework import serializers
from .models import CourseLevel, CourseLevelTranslation


class CourseLevelSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)  # Used for input
    language = serializers.CharField(write_only=True)  # Used for input
    translated_name = serializers.SerializerMethodField()  # Used for output

    class Meta:
        model = CourseLevel
        fields = ["slug", "name", "language", "translated_name"]

    def get_translated_name(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.name if translation else None

    def create(self, validated_data):
        slug = validated_data["slug"]
        language = validated_data["language"]
        name = validated_data["name"]

        # Get or create CourseLevel
        course_level, _ = CourseLevel.objects.get_or_create(slug=slug)

        # Create or update translation
        translation, created = CourseLevelTranslation.objects.update_or_create(
            course_level=course_level, language=language, defaults={"name": name}
        )

        return course_level

    def update(self, instance, validated_data):
        language = validated_data["language"]
        name = validated_data["name"]

        # Update or create translation
        translation, created = CourseLevelTranslation.objects.update_or_create(
            course_level=instance, language=language, defaults={"name": name}
        )

        return instance
