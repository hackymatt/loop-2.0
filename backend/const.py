from django.db.models import TextChoices


class Language(TextChoices):
    EN = "en"
    PL = "pl"


class Urls:
    # ROOT
    API = "api"
    ADMIN = "admin"
    # AUTH
    REGISTER = "auth/register"
    ACTIVATE = "auth/activate"
    RESEND = "auth/resend"
    LOGIN = "auth/login"
    GOOGLE_LOGIN = "auth/google-login"
    GITHUB_LOGIN = "auth/github-login"
    FACEBOOK_LOGIN = "auth/facebook-login"
    LOGOUT = "auth/logout"
    PASSWORD_RESET = "auth/reset-password"
    PASSWORD_RESET_CONFIRM = "auth/reset-password-confirm"
    # COURSE
    COURSE_LEVEL = "course-levels"
    COURSE_TECHNOLOGY = "course-technologies"
    COURSE_CATEGORY = "course-categories"
    COURSE = "courses"
    # CONTACT
    CONTACT = "contact"


class UserType(TextChoices):
    ADMIN = "admin"
    INSTRUCTOR = "instructor"
    STUDENT = "student"


class JoinType(TextChoices):
    EMAIL = "email"
    GOOGLE = "google"
    FACEBOOK = "facebook"
    GITHUB = "github"


class LessonType(TextChoices):
    READING = "reading"
    VIDEO = "video"
    QUIZ = "quiz"
    CODING = "coding"


class QuizType(TextChoices):
    SINGLE = "single"
    MULTI = "multi"
