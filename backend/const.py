from django.db.models import TextChoices


class Urls:
    API = "api"
    ADMIN = "admin"
    REGISTER = "auth/register"
    ACTIVATE = "auth/activate"
    RESEND = "auth/resend"
    LOGIN = "auth/login"
    LOGOUT = "auth/logout"
    PASSWORD_RESET = "auth/reset-password"
    PASSWORD_RESET_CONFIRM = "auth/reset-password-confirm"


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
