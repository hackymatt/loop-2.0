import jwt
import datetime
from django.conf import settings
from django.utils.timezone import make_aware, now
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from .serializers import EmailOnlyUserSerializer
from mailer.mailer import Mailer
from utils.url.url import get_website_url
from global_config import CONFIG

class RegisterView(APIView):
    """
    Custom register view for email and password registration.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Use the simplified serializer that requires only email and password
        serializer = EmailOnlyUserSerializer(data=request.data)

        serializer.validate_email(value=request.data["email"])

        if serializer.is_valid():
            # Save the user data after validation
            user = serializer.save()

            # Send the confirmation email with the activation link
            self.send_activation_email(user)

            return Response(
                {"email": user.email},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_activation_email(self, user):
        """
        Sends the email to activate the user account with a link.
        """
        website_url = get_website_url(self.request)

        expiration_time = datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=24)

        token = jwt.encode(
            {"user_id": user.id, "exp": expiration_time},
            CONFIG["secret"],
            algorithm="HS256"
        )

        activation_url = self.get_activation_url(website_url, token)
        email = user.email

        mailer = Mailer(website_url)

        subject = _("Activate your account")
        message_1 = _(
            "Hi %(email)s, Thank you for registering. Please click the link below to activate your account:"
        ) % {"email": email}
        message_2 = _(
            "The link is valid for 24 hours."
        )
        message_3 = _(
            "If you didn't register on our platform, you can safely ignore this email."
        )

        data = {
            "message_1": message_1,
            "activation_url": activation_url,
            "message_2": message_2,
            "message_3": message_3
        }

        mailer.send(
            email_template="activate.html",
            to=[email],
            subject=subject,
            data=data,
        )

    def get_activation_url(self, website_url, token):
        """
        Generates the URL to confirm the user’s email address with the correct protocol.
        """
        # Generate the activation URL using the correct scheme (http or https)
        return f"{website_url}/auth/activate/{token}"


class ActivateAccountView(APIView):
    """
    View for handling account activation when the user clicks the activation link.
    """

    def get(self, request, token, *args, **kwargs):
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_token.get("user_id")
            exp_timestamp = decoded_token.get("exp")

            if not user_id or not exp_timestamp:
                return Response({"error": _("Invalid token")}, status=status.HTTP_400_BAD_REQUEST)

            expiration_time = make_aware(datetime.datetime.fromtimestamp(exp_timestamp))
            if expiration_time < now():
                return Response({"error": _("Invalid activation link")}, status=status.HTTP_400_BAD_REQUEST)

            user = get_user_model().objects.get(pk=user_id)

            if user.is_active:
                return Response({"error": _("Account is already active")}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.save()

            return Response({"email": user.email}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"error": _("Invalid activation link")}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError:
            return Response({"error": _("Invalid token")}, status=status.HTTP_400_BAD_REQUEST)