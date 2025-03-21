from django.urls import path

from .views import RegisterView, ActivateAccountView

# Define all your API URL patterns
urlpatterns = [
    # Registration and activation routes
    path("auth/register", RegisterView.as_view(), name="register"),
    path(
        "auth/activate/<uid>/<token>", ActivateAccountView.as_view(), name="activate"
    ),
]
