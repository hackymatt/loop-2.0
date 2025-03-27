from rest_framework import serializers
from .models import CourseLevel


class CourseLevelSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = CourseLevel
        fields = ["slug", "name"]

    def get_name(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        translation = obj.translations.filter(language=lang).first()
        return translation.name
