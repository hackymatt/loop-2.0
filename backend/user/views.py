import jwt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from .serializers import EmailOnlyUserSerializer, LoginSerializer
from .utils import send_activation_email
from global_config import CONFIG


class RegisterView(APIView):
    """
    Custom register view for email and password registration.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Use the simplified serializer that requires only email and password
        serializer = EmailOnlyUserSerializer(data=request.data)

        email = request.data.get("email")
        serializer.validate_email(value=email)

        if serializer.is_valid():
            # Save the user data after validation
            user = serializer.save()

            # Send the confirmation email with the activation link
            send_activation_email(request, user)

            return Response(
                {"email": user.email},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateAccountView(APIView):
    """
    View for handling account activation when the user clicks the activation link.
    """

    def post(self, request, *args, **kwargs):
        try:
            token = request.data.get("token", "")

            decoded_token = jwt.decode(token, CONFIG["secret"], algorithms=["HS256"])
            user_id = decoded_token.get("user_id")

            user = get_user_model().objects.get(pk=user_id)

            if user.is_active:
                return Response({"email": user.email}, status=status.HTTP_200_OK)

            user.is_active = True
            user.save()

            return Response({"email": user.email}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response(
                {"error": _("Invalid activation link")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except jwt.InvalidTokenError:
            return Response(
                {"error": _("Invalid token")}, status=status.HTTP_400_BAD_REQUEST
            )
        except get_user_model().DoesNotExist:
            return Response(
                {"error": _("User not found")}, status=status.HTTP_404_NOT_FOUND
            )


class ResendActivationLinkView(APIView):
    """
    View for handling reissue of activation link when the user requests.
    """

    def post(self, request, *args, **kwargs):
        token = request.data.get("token")
        email = request.data.get("email")

        if not token and not email:
            return Response(
                {"error": _("You must provide either a token or an email.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = None

        if token:
            try:
                decoded_token = jwt.decode(
                    token, CONFIG["secret"], algorithms=["HS256"]
                )
                user_id = decoded_token.get("user_id")
                user = get_user_model().objects.filter(pk=user_id).first()
            except jwt.DecodeError:
                return Response(
                    {"error": _("Invalid token.")}, status=status.HTTP_400_BAD_REQUEST
                )
        else:
            user = get_user_model().objects.filter(email=email).first()

        if not user:
            return Response(
                {"error": _("User not found.")}, status=status.HTTP_404_NOT_FOUND
            )

        if user.is_active:
            return Response({"email": user.email}, status=status.HTTP_200_OK)

        send_activation_email(request, user)

        return Response({"email": user.email}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # Create JWT token for the user
            refresh_token = RefreshToken.for_user(user)
            access_token = refresh_token.access_token

            # Return the JWT token in the response
            return Response(
                {
                    "access_token": str(access_token),
                    "refresh_token": str(refresh_token),
                },
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):    
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response({"error": [_("Invalid token")]}, status=status.HTTP_400_BAD_REQUEST)
        

        # Blacklist the refresh token
        try:
            token = RefreshToken(refresh_token)
            token.blacklist() 
        except Exception as e:
            return Response({"error": [_("Refresh token is required")]}, status=status.HTTP_400_BAD_REQUEST)

        return Response({}, status=status.HTTP_205_RESET_CONTENT)

