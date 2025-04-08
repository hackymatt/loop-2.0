from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from ...utils import get_unique_username
from const import JoinType


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
        user, created = get_user_model().objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
                "image": picture,
                "join_type": JoinType.GOOGLE,
            },
        )

        # Create JWT token for the user
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token

        # Return the JWT token in the response
        return Response(
            {
                "email": user.email,
                "access_token": str(access_token),
                "refresh_token": str(refresh_token),
            },
            status=status.HTTP_200_OK,
        )
