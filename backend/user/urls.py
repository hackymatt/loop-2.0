from django.urls import path

from .register.views import RegisterView
from .activate.views import ActivateAccountView, ResendActivationLinkView
from .login.views import LoginView
from .logout.views import LogoutView
from .reset_password.views import PasswordResetView, PasswordResetConfirmView


from const import Urls

# Define all your API URL patterns
urlpatterns = [
    # Registration and activation routes
    path(Urls.REGISTER, RegisterView.as_view(), name="register"),
    path(Urls.ACTIVATE, ActivateAccountView.as_view(), name="activate"),
    path(Urls.RESEND, ResendActivationLinkView.as_view(), name="resend"),
    # Login routes
    path(Urls.LOGIN, LoginView.as_view(), name="login"),
    # Logout routes
    path(Urls.LOGOUT, LogoutView.as_view(), name="logout"),
    # Password routes
    path(Urls.PASSWORD_RESET, PasswordResetView.as_view(), name="password_reset"),
    path(
        Urls.PASSWORD_RESET_CONFIRM,
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
]
