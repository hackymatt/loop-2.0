from rest_framework import serializers
from .models import Chapter
from ..lesson.serializers import LessonSerializer
from ..progress.models import CourseProgress
from const import UserType


class ChapterSerializer(serializers.ModelSerializer):
    translated_name = serializers.SerializerMethodField()  # Used for output
    translated_description = serializers.SerializerMethodField()  # Used for output
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = ["slug", "translated_name", "translated_description", "lessons"]

    def get_translated_name(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).name

    def get_translated_description(self, obj):
        lang = self.context.get("request").LANGUAGE_CODE
        return obj.get_translation(lang).description

    def get_lessons(self, obj):
        return LessonSerializer(obj.lessons.all(), many=True, context=self.context).data

    def to_representation(self, instance):
        data = super().to_representation(instance)

        user = self.context["request"].user
        if user.user_type == UserType.STUDENT:
            progress = self.get_progress(instance, user)
            data["progress"] = progress

        return data

    def get_progress(self, obj, user):
        lessons = obj.lessons.all()
        total = lessons.count()
        completed = CourseProgress.objects.filter(
            student__user=user, lesson__in=lessons
        ).count()

        return int((completed / total) * 100) if total != 0 else 0
