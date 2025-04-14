from django.urls import path

from .register.views import RegisterView
from .activate.views import ActivateAccountView, ResendActivationLinkView
from .login.email.views import LoginView
from .login.google.views import GoogleLoginView
from .login.github.views import GithubLoginView
from .login.facebook.views import FacebookLoginView
from .logout.views import LogoutView
from .reset_password.views import PasswordResetView, PasswordResetConfirmView
from .data.views import UpdateUserView, ChangePasswordView, DeleteAccountView


from const import Urls

# Define all your API URL patterns
urlpatterns = [
    # Registration and activation routes
    path(Urls.REGISTER, RegisterView.as_view(), name="register"),
    path(Urls.ACTIVATE, ActivateAccountView.as_view(), name="activate"),
    path(Urls.RESEND, ResendActivationLinkView.as_view(), name="resend"),
    # Login routes
    path(Urls.LOGIN, LoginView.as_view(), name="login"),
    path(Urls.GOOGLE_LOGIN, GoogleLoginView.as_view(), name="google-login"),
    path(Urls.GITHUB_LOGIN, GithubLoginView.as_view(), name="github-login"),
    path(Urls.FACEBOOK_LOGIN, FacebookLoginView.as_view(), name="facebook-login"),
    # Logout routes
    path(Urls.LOGOUT, LogoutView.as_view(), name="logout"),
    # Password routes
    path(Urls.PASSWORD_RESET, PasswordResetView.as_view(), name="password_reset"),
    path(
        Urls.PASSWORD_RESET_CONFIRM,
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    # User routes
    path(Urls.DATA, UpdateUserView.as_view(), name="data"),
    path(Urls.PASSWORD_CHANGE, ChangePasswordView.as_view(), name="password"),
    path(Urls.DELETE_ACCOUNT, DeleteAccountView.as_view(), name="delete-account"),
]
