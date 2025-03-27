from rest_framework import permissions, viewsets
from .models import CourseLevel
from .serializers import CourseLevelSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser


class CourseLevelViewSet(viewsets.ModelViewSet):
    queryset = CourseLevel.objects.all().order_by("slug")
    serializer_class = CourseLevelSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [
                IsAuthenticated,
                IsAdminUser,
            ]  # Admin only for Create, Update, Delete
        else:
            permission_classes = [permissions.AllowAny]  # Allow read (GET) for anyone
        return [permission() for permission in permission_classes]
