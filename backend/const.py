from django.db.models import TextChoices


class CourseLevel(TextChoices):
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class UserType(TextChoices):
    ADMIN = "admin"
    INSTRUCTOR = "instructor"
    STUDENT = "student"


class JoinType(TextChoices):
    EMAIL = "email"
    GOOGLE = "google"
    FACEBOOK = "facebook"
    GITHUB = "github"
