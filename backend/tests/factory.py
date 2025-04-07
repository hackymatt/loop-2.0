import random
import string
from django.utils import timezone

from django.contrib.auth import get_user_model
from user.utils import get_unique_username
from const import UserType, Language

from user.type.admin_user.models import Admin
from user.type.instructor_user.models import Instructor
from user.type.student_user.models import Student

from blog.tag.models import Tag, TagTranslation
from blog.topic.models import Topic, TopicTranslation
from blog.models import Blog, BlogTranslation

languages = [choice.value for choice in Language]


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


def create_admin_user():
    user, data = create_user()
    user.user_type = UserType.ADMIN
    user.save()
    return user, data


def create_student_user():
    user, data = create_user()
    user.user_type = UserType.STUDENT
    user.save()
    return user, data


def create_instructor_user():
    user, data = create_user()
    user.user_type = UserType.INSTRUCTOR
    user.save()
    return user, data


def create_admin():
    user, data = create_admin_user()
    admin = Admin.objects.create(user=user)
    return admin, data


def create_student():
    user, data = create_student_user()
    student = Student.objects.create(user=user)
    return student, data


def create_instructor():
    user, data = create_instructor_user()
    role = _generate_random_string(5)
    data["role"] = role
    instructor = Instructor.objects.create(user=user, role=role)
    return instructor, data


def create_tag():
    slug = _generate_random_string(8)
    tag = Tag.objects.create(slug=slug)
    data = {"slug": slug}
    for language in languages:
        data[language] = {}
        name = _generate_random_string(5)
        data[language]["name"] = name
        TagTranslation.objects.create(tag=tag, language=language, name=name)
    return tag, data


def create_topic():
    slug = _generate_random_string(8)
    topic = Topic.objects.create(slug=slug)
    data = {"slug": slug}
    for language in languages:
        data[language] = {}
        name = _generate_random_string(5)
        data[language]["name"] = name
        TopicTranslation.objects.create(topic=topic, language=language, name=name)
    return topic, data


def create_blog():
    slug = _generate_random_string(8)
    topic, _ = create_topic()
    tag, _ = create_tag()
    instructor, _ = create_instructor()
    published_at = timezone.now()
    data = {
        "slug": slug,
        "topic": topic,
        "tags": [tag],
        "author": instructor,
        "published_at": published_at,
    }
    blog = Blog.objects.create(
        slug=slug,
        topic=topic,
        author=instructor,
        published_at=published_at,
        active=True,
    )
    blog.tags.add(tag)
    for language in languages:
        data[language] = {}
        name = _generate_random_string(5)
        description = _generate_random_string(50)
        content = _generate_random_string(250)
        data[language]["name"] = name
        data[language]["description"] = description
        data[language]["content"] = content
        BlogTranslation.objects.create(
            blog=blog,
            language=language,
            name=name,
            description=description,
            content=content,
        )
    return blog, data
