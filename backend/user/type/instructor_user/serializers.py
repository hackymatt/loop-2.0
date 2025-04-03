from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Instructor

User = get_user_model()


class InstructorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()  # Get full name
    image = serializers.ImageField(
        source="user.image", read_only=True
    )  # Get user image

    class Meta:
        model = Instructor
        fields = ["full_name", "image", "role"]

    def get_full_name(self, obj):
        """Return the full name of the instructor."""
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
