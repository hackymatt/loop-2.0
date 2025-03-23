from django.urls import path

from .views import RegisterView, ActivateAccountView, ResendActivationLinkView

# Define all your API URL patterns
urlpatterns = [
    # Registration and activation routes
    path("auth/register", RegisterView.as_view(), name="register"),
    path(
        "auth/activate", ActivateAccountView.as_view(), name="activate"
    ),
    path(
        "auth/resend", ResendActivationLinkView.as_view(), name="resend"
    ),
]
