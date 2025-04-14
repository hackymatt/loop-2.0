from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from plan.subscription.utils import get_active_user_plan
from ...utils import set_cookies
from const import UserType


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # Create JWT token for the user
            refresh_token = RefreshToken.for_user(user)
            access_token = refresh_token.access_token

            response = Response(
                {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "user_type": user.user_type,
                    "is_active": user.is_active,
                    "join_type": user.join_type,
                    "plan": get_active_user_plan(user).slug
                    if user.user_type == UserType.STUDENT
                    else None,
                },
                status=status.HTTP_200_OK,
            )

            return set_cookies(response, access_token, refresh_token)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
