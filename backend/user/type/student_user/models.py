from django.db import models
from core.base_model import BaseModel
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from const import UserType


class Student(BaseModel):
    user = models.OneToOneField(
        get_user_model(), on_delete=models.CASCADE, related_name="student_profile"
    )

    def clean(self):
        """Ensure only users with user_type=STUDENT can be assigned"""
        if self.user.user_type != UserType.STUDENT:
            raise ValidationError(
                f"Student profile can only be created for {UserType.STUDENT} users."
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Student Profile: {self.user.email}"

    class Meta:
        db_table = "student"
