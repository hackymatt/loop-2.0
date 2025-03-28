from rest_framework import serializers
from .models import CourseTechnology, CourseTechnologyTranslation


class CourseTechnologySerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)  # Used for input
    language = serializers.CharField(write_only=True)  # Used for input
    translated_name = serializers.SerializerMethodField()  # Used for output

    class Meta:
        model = CourseTechnology
        fields = ["slug", "name", "language", "translated_name"]

    def get_translated_name(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.name if translation else None

    def create(self, validated_data):
        slug = validated_data["slug"]
        language = validated_data["language"]
        name = validated_data["name"]

        # Get or create CourseTechnology
        course_technology, _ = CourseTechnology.objects.get_or_create(slug=slug)

        # Create or update translation
        translation, created = CourseTechnologyTranslation.objects.update_or_create(
            course_technology=course_technology,
            language=language,
            defaults={"name": name},
        )

        return course_technology

    def update(self, instance, validated_data):
        language = validated_data["language"]
        name = validated_data["name"]

        # Update or create translation
        translation, created = CourseTechnologyTranslation.objects.update_or_create(
            course_technology=instance, language=language, defaults={"name": name}
        )

        return instance
