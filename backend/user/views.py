from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import EmailOnlyUserSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User


class RegisterView(APIView):
    """
    Custom register view for email and password registration.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Use the simplified serializer that requires only email and password
        serializer = EmailOnlyUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Send the confirmation email with the activation link
            self.send_activation_email(user)

            return Response(
                {
                    "message": "Registration successful. Please check your email for activation."
                },
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

        # Send the email to the user with the activation link
        subject = "Activate your account"
        message = f"Hi {user.email},\n\nThank you for registering. Please click the link below to activate your account:\n\n{activation_url}"

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
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
                    {"message": "Account successfully activated!"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
                )

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid activation link"}, status=status.HTTP_400_BAD_REQUEST
            )
