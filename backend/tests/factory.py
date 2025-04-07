import random
import string
from django.utils import timezone

from django.contrib.auth import get_user_model
from user.utils import get_unique_username
from const import UserType, Language, LessonType, QuizType

from user.type.admin_user.models import Admin
from user.type.instructor_user.models import Instructor
from user.type.student_user.models import Student

from blog.tag.models import Tag, TagTranslation
from blog.topic.models import Topic, TopicTranslation
from blog.models import Blog, BlogTranslation

from course.category.models import Category, CategoryTranslation
from course.level.models import Level, LevelTranslation
from course.technology.models import Technology
from course.chapter.models import Chapter, ChapterTranslation
from course.lesson.models import (
    Lesson,
    QuizLesson,
    QuizLessonTranslation,
    ReadingLesson,
    ReadingLessonTranslation,
    VideoLesson,
    VideoLessonTranslation,
    CodingLesson,
    CodingLessonTranslation,
)
from course.models import Course, CourseTranslation

from review.models import Review

languages = [choice.value for choice in Language]


def _generate_random_string(length=10):
    """Generate a random alphanumeric string of a given length."""
    characters = string.ascii_letters + string.digits  # a-zA-Z0-9
    return "".join(random.choices(characters, k=length))


def _generate_random_number(min_val=1, max_val=100):
    return random.randint(min_val, max_val)


def _generate_random_email(domain="example.com", length=10):
    """Generate a random email address with a given domain and local-part length."""
    local_part = _generate_random_string(length)
    return f"{local_part}@{domain}"


def _generate_random_url(domain="example.com"):
    path = _generate_random_string(10)
    return f"https://{domain}/{path}"


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
    tags = [create_tag()[0] for _ in range(_generate_random_number())]
    instructor, _ = create_instructor()
    published_at = timezone.now()
    data = {
        "slug": slug,
        "topic": topic,
        "tags": tags,
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
    blog.tags.add(*tags)
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


def create_category():
    slug = _generate_random_string(8)
    category = Category.objects.create(slug=slug)
    data = {"slug": slug}
    for language in languages:
        data[language] = {}
        name = _generate_random_string(5)
        data[language]["name"] = name
        CategoryTranslation.objects.create(
            category=category, language=language, name=name
        )
    return category, data


def create_level():
    slug = _generate_random_string(8)
    level = Level.objects.create(slug=slug)
    data = {"slug": slug}
    for language in languages:
        data[language] = {}
        name = _generate_random_string(5)
        data[language]["name"] = name
        LevelTranslation.objects.create(level=level, language=language, name=name)
    return level, data


def create_technology():
    slug = _generate_random_string(8)
    name = _generate_random_string(5)
    technology = Technology.objects.create(slug=slug, name=name)
    return technology, {"slug": slug, "name": name}


def create_lesson():
    slug = _generate_random_string(8)
    points = _generate_random_number()
    type = random.choice(
        [LessonType.READING, LessonType.VIDEO, LessonType.QUIZ, LessonType.CODING]
    )
    data = {
        "slug": slug,
        "points": points,
        "type": type,
    }
    lesson = Lesson.objects.create(slug=slug, points=points, type=type, active=True)
    if type == LessonType.READING:
        specific_lesson = ReadingLesson.objects.create(lesson=lesson)
        for language in languages:
            data[language] = {}
            name = _generate_random_string(5)
            text = _generate_random_string(250)
            data[language]["name"] = name
            data[language]["text"] = text
            ReadingLessonTranslation.objects.create(
                lesson=specific_lesson, language=language, name=name, text=text
            )
    elif type == LessonType.VIDEO:
        video_url = _generate_random_url()
        data["video_url"] = video_url
        specific_lesson = VideoLesson.objects.create(lesson=lesson, video_url=video_url)
        for language in languages:
            data[language] = {}
            name = _generate_random_string(5)
            data[language]["name"] = name
            VideoLessonTranslation.objects.create(
                lesson=specific_lesson, language=language, name=name
            )
    elif type == LessonType.QUIZ:
        quiz_type = random.choice([QuizType.SINGLE, QuizType.MULTI])
        data["quiz_type"] = quiz_type
        specific_lesson = QuizLesson.objects.create(lesson=lesson, quiz_type=quiz_type)
        for language in languages:
            data[language] = {}
            name = _generate_random_string(5)
            questions = _generate_random_string(50)
            data[language]["name"] = name
            data[language]["questions"] = questions
            QuizLessonTranslation.objects.create(
                lesson=specific_lesson,
                language=language,
                name=name,
                questions=questions,
            )
    elif type == LessonType.CODING:
        starter_code = _generate_random_string(50)
        solution_code = _generate_random_string(50)
        penalty_points = _generate_random_number()
        data["starter_code"] = starter_code
        data["solution_code"] = solution_code
        data["penalty_points"] = penalty_points
        specific_lesson = CodingLesson.objects.create(
            lesson=lesson,
            starter_code=starter_code,
            solution_code=solution_code,
            penalty_points=penalty_points,
        )
        for language in languages:
            data[language] = {}
            name = _generate_random_string(5)
            introduction = _generate_random_string(50)
            instructions = _generate_random_string(50)
            hint = _generate_random_string(50)
            data[language]["name"] = name
            data[language]["introduction"] = introduction
            data[language]["instructions"] = instructions
            data[language]["hint"] = hint
            CodingLessonTranslation.objects.create(
                lesson=specific_lesson,
                language=language,
                name=name,
                introduction=introduction,
                instructions=instructions,
                hint=hint,
            )
    return lesson, data


def create_chapter():
    slug = _generate_random_string(8)
    lessons = [create_lesson()[0] for _ in range(_generate_random_number(1, 15))]
    data = {"slug": slug, "lessons": lessons}
    chapter = Chapter.objects.create(slug=slug, active=True)
    chapter.lessons.add(*lessons)
    for language in languages:
        data[language] = {}
        name = _generate_random_string(5)
        description = _generate_random_string(50)
        data[language]["name"] = name
        data[language]["description"] = description
        ChapterTranslation.objects.create(
            chapter=chapter,
            language=language,
            name=name,
            description=description,
        )
    return chapter, data


def create_course():
    slug = _generate_random_string(8)
    technology, _ = create_technology()
    level, _ = create_level()
    category, _ = create_category()
    duration = _generate_random_number()
    chat_url = _generate_random_url()
    chapters = [create_chapter()[0] for _ in range(_generate_random_number(1, 10))]
    instructors = [create_instructor()[0] for _ in range(_generate_random_number(1, 3))]
    data = {
        "slug": slug,
        "technology": technology,
        "level": level,
        "category": category,
        "duration": duration,
        "chat_url": chat_url,
        "instructors": instructors,
    }
    course = Course.objects.create(
        slug=slug,
        technology=technology,
        level=level,
        category=category,
        duration=duration,
        chat_url=chat_url,
        active=True,
    )
    course.instructors.add(*instructors)
    course.chapters.add(*chapters)
    for language in languages:
        data[language] = {}
        name = _generate_random_string(5)
        description = _generate_random_string(50)
        overview = _generate_random_string(250)
        data[language]["name"] = name
        data[language]["description"] = description
        data[language]["overview"] = overview
        CourseTranslation.objects.create(
            course=course,
            language=language,
            name=name,
            description=description,
            overview=overview,
        )
    return course, data


def create_review():
    student, _ = create_student()
    course, _ = create_course()
    rating = _generate_random_number(1, 5)
    language = random.choice(languages)
    comment = _generate_random_string(50)
    review = Review.objects.create(
            student=student,
            course=course,
            rating=rating,
            language=language,
            comment=comment,
        )
    return review, {
        "student": student,
        "course": course,
        "rating": rating,
        "language": language,
        "comment": comment,
    }