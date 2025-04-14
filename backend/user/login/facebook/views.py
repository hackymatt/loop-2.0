from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from plan.subscription.utils import get_active_user_plan
from user.type.student_user.models import Student
from ...utils import get_unique_username, set_cookies, download_and_assign_image
from plan.subscription.utils import subscribe
from const import JoinType, UserType


class FacebookLoginView(APIView):
    def post(self, request):
        access_token = request.data.get("access_token")

        if not access_token:
            return Response(
                {"root": _("Access token is required")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify token with Facebook
        facebook_response = requests.get(
            f"https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token={access_token}"
        ).json()

        if "email" not in facebook_response:
            return Response(
                {"root": _("Invalid token")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = facebook_response["email"]
        username = get_unique_username(email.split("@")[0])
        first_name = facebook_response.get("first_name", "")
        last_name = facebook_response.get("last_name", "")
        picture = facebook_response.get("picture", {}).get("data", {}).get("url", "")

        # Create user or get existing one
        user, user_created = get_user_model().objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                "user_type": UserType.STUDENT,
                "join_type": JoinType.FACEBOOK,
                "is_active": True,
            },
        )
        student, student_created = Student.objects.get_or_create(user=user)
        subscribe(student)

        if user_created:
            download_and_assign_image(user, picture)

        # Create JWT tokens for the user
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token

        response = Response(
            {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "image": request.build_absolute_uri(user.image.url)
                if user.image and user.image.url
                else None,
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
