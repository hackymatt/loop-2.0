import os
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from const import UserType, JoinType

def user_directory_path(instance, filename):
    """
    Generate a unique filename for the user's profile picture.
    Example: media/profiles/8f3a9b2d-5c4a-4a2a-ae4b-91d2f4b7a6e8.jpg
    """
    ext = filename.split(".")[-1]  # Get file extension (e.g., jpg, png)
    filename = f"{uuid.uuid4()}.{ext}"  # Generate a unique filename
    return os.path.join("profiles", filename)


class User(AbstractUser):
    email = models.EmailField(unique=True)  # Unique and required
    first_name = models.CharField(max_length=30, blank=True, null=True)  # Optional
    last_name = models.CharField(max_length=30, blank=True, null=True)  # Optional
    image = models.ImageField(
        upload_to=user_directory_path, blank=True, null=True
    )  # User profile picture
    is_active = models.BooleanField(
        default=False
    )  # User must activate account via email
    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.STUDENT,
    )
    join_type = models.CharField(
        max_length=10,
        choices=JoinType.choices,
        default=JoinType.EMAIL,
    )

    USERNAME_FIELD = "email"  # Login with email instead of username
    REQUIRED_FIELDS = ["username"]  # Only username is required additionally

    def save(self, *args, **kwargs):
        # Automatically assign is_superuser and is_staff based on user type
        if self.user_type == self.UserType.ADMIN:
            self.is_superuser = True
            self.is_staff = True
        elif self.user_type == self.UserType.INSTRUCTOR:
            self.is_superuser = False
            self.is_staff = True
        else:  # Student
            self.is_superuser = False
            self.is_staff = False

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.get_user_type_display()} - {self.get_join_type_display()})"

    class Meta:
        db_table = "user"
