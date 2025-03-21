from django.db.models import TextChoices


class CourseLevel(TextChoices):
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class UserType(TextChoices):
    STUDENT = "student"
    ADMIN = "admin"


class JoinType(TextChoices):
    EMAIL = "email"
    GOOGLE = "google"
    FACEBOOK = "facebook"
    GITHUB = "github"
