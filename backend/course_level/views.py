from rest_framework import viewsets
from course_level.models import CourseLevel
from course_level.serializers import CourseLevelSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


class CourseLevelViewSet(viewsets.ModelViewSet):
    queryset = CourseLevel.objects.prefetch_related("translations").order_by("order")
    serializer_class = CourseLevelSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [
                IsAuthenticated,
                IsAdminUser,
            ]  # Admin only for Create, Update, Delete
        else:
            permission_classes = [AllowAny]  # Allow read (GET) for anyone
        return [permission() for permission in permission_classes]  # Everyone can read
