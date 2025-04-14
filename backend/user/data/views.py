from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UpdateUserSerializer

User = get_user_model()

class UpdateUserView(UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
