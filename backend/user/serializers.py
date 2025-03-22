from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from rest_framework import serializers
import re


class EmailOnlyUserSerializer(serializers.ModelSerializer):
    """
    Custom user serializer for registration using only email and password.
    """

    class Meta:
        model = get_user_model()
        fields = ["email", "password"]  # Only email and password are needed
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_email(self, value):
        """
        Check if the email is already registered.
        """
        if get_user_model().objects.filter(email=value).exists():
            raise serializers.ValidationError(
                {"email": [_("Account with this email address already exists.")]}
            )
        return value
    
    def validate_password(self, value):
        """
        Validate the password to ensure it meets the required criteria:
        - Minimum 8 characters
        - At least 1 uppercase letter
        - At least 1 lowercase letter
        - At least 1 special character
        - At least 1 digit
        """
        password = value

        if len(password) < 8:
            raise serializers.ValidationError(
                {"password": [_("Password must be at least 8 characters long.")]}
            )

        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError(
                {"password": [_("Password must contain at least one uppercase letter.")]}
            )

        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError(
                {"password": [_("Password must contain at least one lowercase letter.")]}
            )

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise serializers.ValidationError(
                {"password": [_("Password must contain at least one special character.")]}
            )

        if not re.search(r'\d', password):
            raise serializers.ValidationError(
                {"password": [_("Password must contain at least one digit.")]}
            )

        return value
    
    def create(self, validated_data):
        # Get the email and extract the part before '@' to create the username
        email = validated_data["email"]
        username = email.split("@")[0]

        # Ensure the username is unique
        username = self.get_unique_username(username)

        user = get_user_model().objects.create_user(
            username=username,  # Use the unique username
            email=email,
            password=validated_data["password"],
        )
        user.is_active = False  # Set user as inactive initially
        user.save()
        return user

    def get_unique_username(self, base_username):
        """
        Ensures the generated username is unique by appending a number if needed.
        """
        username = base_username
        counter = 1

        while get_user_model().objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        return username
