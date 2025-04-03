from rest_framework import viewsets
from .models import Course
from .serializers import CourseListSerializer, CourseRetrieveSerializer
from .filters import CourseFilter
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.prefetch_related(
        "instructors", "chapters", "translations"
    ).order_by("slug")
    filterset_class = CourseFilter

    def get_serializer_class(self):
        # Return different serializer depending on the action
        if self.action == "list":
            return CourseListSerializer  # Use list serializer for listing
        elif self.action == "retrieve":
            return CourseRetrieveSerializer  # Use retrieve serializer for single course retrieval
        return (
            super().get_serializer_class()
        )  # Default serializer for other actions (e.g., create, update, delete)

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [
                IsAuthenticated,
                IsAdminUser,
            ]  # Admin only for Create, Update, Delete
        else:
            permission_classes = [AllowAny]  # Allow read (GET) for anyone
        return [permission() for permission in permission_classes]  # Everyone can read
