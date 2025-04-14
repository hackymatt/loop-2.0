from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from plan.subscription.utils import get_active_user_plan
from ...utils import get_unique_username, set_cookies, download_and_assign_image
from plan.subscription.utils import subscribe
from user.type.student_user.models import Student
from const import JoinType, UserType


class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get("token")

        # Verify token in Google
        google_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token}"},
        ).json()

        if "email" not in google_response:
            return Response(
                {"root": _("Invalid token")}, status=status.HTTP_400_BAD_REQUEST
            )

        email = google_response["email"]
        username = email.split("@")[0]
        username = get_unique_username(username)
        first_name = google_response.get("given_name", "")
        last_name = google_response.get("family_name", "")
        picture = google_response.get("picture", "")

        # Create user or get
        user, user_created = get_user_model().objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
                "join_type": JoinType.GOOGLE,
                "is_active": True,
            },
        )
        student, student_created = Student.objects.get_or_create(user=user)
        subscribe(student)

        if user_created:
            download_and_assign_image(user, picture)

        # Create JWT token for the user
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
