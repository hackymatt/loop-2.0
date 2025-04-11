from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from ...utils import get_unique_username, set_cookies
from const import JoinType


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
        user, created = get_user_model().objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                "image": picture,
                "join_type": JoinType.FACEBOOK,
            },
        )

        # Create JWT tokens for the user
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token

        response = Response(
            {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
            status=status.HTTP_200_OK,
        )

        return set_cookies(response, access_token, refresh_token)