from django.db.models import F
from rest_framework import viewsets
from .models import CourseTechnology
from .serializers import CourseTechnologySerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


class CourseTechnologyViewSet(viewsets.ModelViewSet):
    queryset = CourseTechnology.objects.prefetch_related("translations").annotate(translation_name=F('translations__name')).order_by('translation_name')
    serializer_class = CourseTechnologySerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [
                IsAuthenticated,
                IsAdminUser,
            ]  # Admin only for Create, Update, Delete
        else:
            permission_classes = [AllowAny]  # Allow read (GET) for anyone
        return [permission() for permission in permission_classes]  # Everyone can read
