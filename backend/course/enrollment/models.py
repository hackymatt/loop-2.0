from django.db import models
from core.base_model import BaseModel
from user.type.student_user.models import Student
from ..models import Course
from global_config import CONFIG


def get_dummy_student():
    """Returns the dummy student instance."""
    return Student.objects.get(
        user__email=CONFIG["dummy_student_email"]
    )  # pragma: no cover


class CourseEnrollment(BaseModel):
    student = models.ForeignKey(
        Student, on_delete=models.SET(get_dummy_student), related_name="enrollments"
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )

    class Meta:
        db_table = "course_enrollment"
        unique_together = (
            "student",
            "course",
        )  # Ensures that a student can only enroll in a course once

    def __str__(self):
        return f"{self.student.user.email} started {self.course.slug} on {self.created_at}"  # pragma: no cover
