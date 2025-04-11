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
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


def _generate_random_number(min_val=1, max_val=100):
    return random.randint(min_val, max_val)


def _generate_random_slug():
    return f"{int(timezone.now().timestamp() * 1000)}{_generate_random_string()}"


def _generate_random_email(domain="example.com", length=10):
    local_part = _generate_random_string(length)
    return f"{local_part}@{domain}"


def _generate_random_url(domain="example.com"):
    return f"https://{domain}/{_generate_random_string(10)}"


def _create_translations(model, obj, languages, translation_fields, related_field_name):
    translations = {}
    for language in languages:
        # Create translation data with random string generation
        translation_data = {
            field: _generate_random_string(50) for field in translation_fields
        }

        # Add the related object (e.g., 'level' or 'topic') dynamically
        translation_data.update(
            {"language": language, related_field_name: obj, **translation_data}
        )

        # Create the translation instance and store it in the dictionary
        translations[language] = model.objects.create(**translation_data)

    return translations


def create_user():
    email = _generate_random_email()
    username = get_unique_username(email.split("@")[0])
    password = _generate_random_string(12)

    user = get_user_model().objects.create_user(
        email=email, password=password, username=username, is_active=True
    )
    return user, password


def create_user_with_type(user_type):
    user, password = create_user()
    user.user_type = user_type
    user.save()
    return user, password


def create_admin_user():
    return create_user_with_type(UserType.ADMIN)


def create_student_user():
    return create_user_with_type(UserType.STUDENT)


def create_instructor_user():
    return create_user_with_type(UserType.INSTRUCTOR)


def create_admin():
    user, password = create_user_with_type(UserType.ADMIN)
    admin = Admin.objects.create(user=user)
    return admin, password


def create_student():
    user, password = create_user_with_type(UserType.STUDENT)
    student = Student.objects.create(user=user)
    return student, password


def create_instructor():
    user, password = create_user_with_type(UserType.INSTRUCTOR)
    role = _generate_random_string(5)
    instructor = Instructor.objects.create(user=user, role=role)
    return instructor, password


def create_tag():
    slug = _generate_random_slug()
    tag = Tag.objects.create(slug=slug)
    translations = _create_translations(TagTranslation, tag, languages, ["name"], "tag")
    return tag, translations


def create_topic():
    slug = _generate_random_slug()
    topic = Topic.objects.create(slug=slug)
    translations = _create_translations(
        TopicTranslation, topic, languages, ["name"], "topic"
    )
    return topic, translations


def create_blog():
    slug = _generate_random_slug()
    topic, _ = create_topic()
    tags = [create_tag()[0] for _ in range(_generate_random_number())]
    instructor, _ = create_instructor()
    published_at = timezone.now()

    blog = Blog.objects.create(
        slug=slug,
        topic=topic,
        author=instructor,
        published_at=published_at,
        active=True,
    )
    blog.tags.add(*tags)

    translations = _create_translations(
        BlogTranslation, blog, languages, ["name", "description", "content"], "blog"
    )
    return blog, translations


def create_category():
    slug = _generate_random_slug()
    category = Category.objects.create(slug=slug)
    translations = _create_translations(
        CategoryTranslation, category, languages, ["name"], "category"
    )
    return category, translations


def create_level():
    slug = _generate_random_slug()
    level = Level.objects.create(slug=slug)
    translations = _create_translations(
        LevelTranslation, level, languages, ["name"], "level"
    )
    return level, translations


def create_technology():
    slug = _generate_random_slug()
    name = _generate_random_string(5)
    technology = Technology.objects.create(slug=slug, name=name)
    return technology


def create_lesson():
    slug = _generate_random_slug()
    points = _generate_random_number()
    lesson_type = random.choice(
        [LessonType.READING, LessonType.VIDEO, LessonType.QUIZ, LessonType.CODING]
    )

    lesson = Lesson.objects.create(
        slug=slug, points=points, type=lesson_type, active=True
    )
    specific_lesson, translations = None, {}

    if lesson_type == LessonType.READING:
        specific_lesson = ReadingLesson.objects.create(lesson=lesson)
        translations = _create_translations(
            ReadingLessonTranslation,
            specific_lesson,
            languages,
            ["name", "text"],
            "lesson",
        )
    elif lesson_type == LessonType.VIDEO:
        video_url = _generate_random_url()
        specific_lesson = VideoLesson.objects.create(lesson=lesson, video_url=video_url)
        translations = _create_translations(
            VideoLessonTranslation, specific_lesson, languages, ["name"], "lesson"
        )
    elif lesson_type == LessonType.QUIZ:
        quiz_type = random.choice([QuizType.SINGLE, QuizType.MULTI])
        specific_lesson = QuizLesson.objects.create(lesson=lesson, quiz_type=quiz_type)
        translations = _create_translations(
            QuizLessonTranslation,
            specific_lesson,
            languages,
            ["name", "questions"],
            "lesson",
        )
    elif lesson_type == LessonType.CODING:
        starter_code = _generate_random_string(50)
        solution_code = _generate_random_string(50)
        penalty_points = _generate_random_number()
        technology = create_technology()
        specific_lesson = CodingLesson.objects.create(
            lesson=lesson,
            technology=technology,
            starter_code=starter_code,
            solution_code=solution_code,
            penalty_points=penalty_points,
        )
        translations = _create_translations(
            CodingLessonTranslation,
            specific_lesson,
            languages,
            ["name", "introduction", "instructions", "hint"],
            "lesson",
        )

    return lesson, specific_lesson, translations


def create_chapter():
    slug = _generate_random_slug()
    lessons = [create_lesson()[0] for _ in range(_generate_random_number(10, 15))]
    chapter = Chapter.objects.create(slug=slug, active=True)
    chapter.lessons.add(*lessons)

    translations = _create_translations(
        ChapterTranslation, chapter, languages, ["name", "description"], "chapter"
    )
    return chapter, translations


def create_course():
    slug = _generate_random_slug()
    technology = create_technology()
    level, _ = create_level()
    category, _ = create_category()
    duration = _generate_random_number()
    chat_url = _generate_random_url()
    chapters = [create_chapter()[0] for _ in range(_generate_random_number(5, 10))]
    instructors = [create_instructor()[0] for _ in range(_generate_random_number(1, 3))]

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

    translations = _create_translations(
        CourseTranslation,
        course,
        languages,
        ["name", "description", "overview"],
        "course",
    )
    return course, translations


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
    return review
