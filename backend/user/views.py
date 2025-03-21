from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from .serializers import EmailOnlyUserSerializer
from mailer.mailer import Mailer


class RegisterView(APIView):
    """
    Custom register view for email and password registration.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Use the simplified serializer that requires only email and password
        serializer = EmailOnlyUserSerializer(data=request.data)

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
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(str(user.pk).encode())

        activation_url = self.get_activation_url(uid, token)
        email = user.email

        mailer = Mailer()

        subject = _("Activate your account")
        message_1 = _(
            "Hi %(email)s, Thank you for registering. Please click the link below to activate your account:"
        ) % {"email": email}
        message_2 = _(
            "If you didn't register on our platform, you can safely ignore this email."
        )

        data = {
            "message_1": message_1,
            "activation_url": activation_url,
            "message_2": message_2,
        }

        mailer.send(
            email_template="activate.html",
            to=[email],
            subject=subject,
            data=data,
        )

    def get_activation_url(self, uid, token):
        """
        Generates the URL to confirm the user’s email address with the correct protocol.
        """
        # Check if the request is using HTTPS or HTTP
        scheme = self.request.scheme  # This gives us 'http' or 'https'

        # Get the domain for the current site
        domain = get_current_site(self.request).domain

        # Generate the activation URL using the correct scheme (http or https)
        return f"{scheme}://{domain}/auth/activate/{uid}/{token}/"


class ActivateAccountView(APIView):
    """
    View for handling account activation when the user clicks the activation link.
    """

    def get(self, request, uid, token, *args, **kwargs):
        try:
            # Decode the user ID from the URL
            uid = urlsafe_base64_decode(uid).decode()

            # Get the user model
            user = get_user_model().objects.get(pk=uid)

            # Check if the token is valid
            if default_token_generator.check_token(user, token):
                # Activate the user account
                user.is_active = True
                user.save()

                return Response(
                    {},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": _("Invalid token")}, status=status.HTTP_400_BAD_REQUEST
                )

        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            return Response(
                {"error": _("Invalid activation link")},
                status=status.HTTP_400_BAD_REQUEST,
            )
