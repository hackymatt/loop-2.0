from django.urls import path

from .views import (
    RegisterView,
    ActivateAccountView,
    ResendActivationLinkView,
    LoginView,
    LogoutView
)

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
]
