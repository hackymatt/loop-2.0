from django.contrib.auth import get_user_model
from rest_framework import serializers


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
