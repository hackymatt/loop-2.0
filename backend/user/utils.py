import jwt
import datetime
from mailer.mailer import Mailer
from utils.url.url import get_website_url
from global_config import CONFIG
from django.utils.translation import gettext as _

def send_activation_email(request, user):
    """
    Sends the email to activate the user account with a link.
    """
    website_url = get_website_url(request)

    expiration_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)

    token = jwt.encode(
        {"user_id": user.id, "exp": expiration_time},
        CONFIG["secret"],
        algorithm="HS256"
    )

    activation_url = get_activation_url(website_url, token)
    email = user.email

    mailer = Mailer(website_url)

    subject = _("Activate your account")
    message_1 = _(
        "Hi %(email)s, Thank you for registering. Please click the link below to activate your account:"
    ) % {"email": email}
    message_2 = _(
        "The link is valid for 24 hours."
    )
    message_3 = _(
        "If you didn't register on our platform, you can safely ignore this email."
    )

    data = {
        "message_1": message_1,
        "activation_url": activation_url,
        "message_2": message_2,
        "message_3": message_3
    }

    mailer.send(
        email_template="activate.html",
        to=[email],
        subject=subject,
        data=data,
    )

def get_activation_url(website_url, token):
    """
    Generates the URL to confirm the user’s email address with the correct protocol.
    """
    # Generate the activation URL using the correct scheme (http or https)
    return f"{website_url}/auth/activate/{token}"