from rest_framework import viewsets
from .models import Course
from .serializers import CourseSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.prefetch_related("instructors", "chapters", "translations").order_by("slug")
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [
                IsAuthenticated,
                IsAdminUser,
            ]  # Admin only for Create, Update, Delete
        else:
            permission_classes = [AllowAny]  # Allow read (GET) for anyone
        return [permission() for permission in permission_classes]  # Everyone can read
