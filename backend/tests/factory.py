import random
import string

from django.contrib.auth import get_user_model
from user.utils import get_unique_username


def _generate_random_string(length=10):
    """Generate a random alphanumeric string of a given length."""
    characters = string.ascii_letters + string.digits  # a-zA-Z0-9
    return "".join(random.choices(characters, k=length))


def _generate_random_email(domain="example.com", length=10):
    """Generate a random email address with a given domain and local-part length."""
    local_part = _generate_random_string(length)
    return f"{local_part}@{domain}"


def create_user():
    email = _generate_random_email()
    username = get_unique_username(email.split("@")[0])
    password = _generate_random_string(12)

    user = get_user_model().objects.create_user(
        email=email, password=password, username=username, is_active=True
    )
    return user, {"email": email, "password": password, "username": username}
