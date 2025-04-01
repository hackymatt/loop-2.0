from django.db.models import F
from rest_framework import viewsets
from .models import Technology
from .serializers import TechnologySerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.order_by("name")
    serializer_class = TechnologySerializer

    def get_permissions(self):
        if self.action in ["create", "update", "destroy"]:
            permission_classes = [
                IsAuthenticated,
                IsAdminUser,
            ]  # Admin only for Create, Update, Delete
        else:
            permission_classes = [AllowAny]  # Allow read (GET) for anyone
        return [permission() for permission in permission_classes]  # Everyone can read
