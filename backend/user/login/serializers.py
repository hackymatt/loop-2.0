from django.contrib.auth import get_user_model
from rest_framework import serializers
from plan.subscription.utils import get_active_user_plan
from const import UserType


class LoginResponseSerializer(serializers.ModelSerializer):
    plan = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = [
            "email",
            "first_name",
            "last_name",
            "image",
            "user_type",
            "is_active",
            "join_type",
            "plan",
        ]

    def get_plan(self, obj):
        return (
            get_active_user_plan(obj).slug
            if obj.user_type == UserType.STUDENT
            else None
        )

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url") and request:
            return request.build_absolute_uri(obj.image.url)
        return None
