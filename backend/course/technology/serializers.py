from rest_framework import serializers
from .models import CourseTechnology


class CourseTechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTechnology
        fields = ["slug", "name"]
