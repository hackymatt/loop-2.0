from django.db import migrations
from django.contrib.auth import get_user_model
from global_config import CONFIG
from const import UserType


def generate_superuser(apps, schema_editor):
    user = get_user_model()
    email = CONFIG["admin_email"]
    username = email.split("@")[0]
    password = CONFIG["admin_password"]

    if not user.objects.filter(email=email).exists():
        admin = user.objects.create(username=username, email=email, user_type=UserType.ADMIN)
        admin.set_password(password)
        admin.save()


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [migrations.RunPython(generate_superuser)]
