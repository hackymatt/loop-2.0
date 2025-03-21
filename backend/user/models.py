import os
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


def user_directory_path(instance, filename):
    """
    Generate a unique filename for the user's profile picture.
    Example: media/profiles/8f3a9b2d-5c4a-4a2a-ae4b-91d2f4b7a6e8.jpg
    """
    ext = filename.split(".")[-1]  # Get file extension (e.g., jpg, png)
    filename = f"{uuid.uuid4()}.{ext}"  # Generate a unique filename
    return os.path.join("profiles", filename)


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)  # Unique and required
    first_name = models.CharField(max_length=30, blank=True, null=True)  # Optional
    last_name = models.CharField(max_length=30, blank=True, null=True)  # Optional
    image = models.ImageField(
        upload_to=user_directory_path, blank=True, null=True
    )  # User profile picture
    is_active = models.BooleanField(
        default=False
    )  # User must activate account via email

    USERNAME_FIELD = "email"  # Login with email instead of username
    REQUIRED_FIELDS = ["username"]  # Only username is required additionally

    def __str__(self):
        return self.email
