from django.db import models
from django.contrib.auth import get_user_model
from core.base_model import BaseModel
from const import Language
from .chapter.models import Chapter
from .level.models import Level
from .category.models import Category
from .technology.models import Technology
from user.type.instructor_user.models import Instructor


class Course(BaseModel):
    slug = models.SlugField(unique=True)
    level = models.ForeignKey(Level, on_delete=models.PROTECT)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    technology = models.ForeignKey(Technology, on_delete=models.PROTECT)
    chapters = models.ManyToManyField(Chapter, related_name="courses")
    instructors = models.ManyToManyField(Instructor, related_name="courses")
    duration = models.PositiveIntegerField()
    chat_url = models.URLField()
    active = models.BooleanField(default=False)

    class Meta:
        db_table = "course"

    def __str__(self):
        return self.slug  # pragma: no cover


class CourseTranslation(BaseModel):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    overview = models.TextField()

    class Meta:
        db_table = "course_translation"
        unique_together = ("course", "language")
        verbose_name_plural = "Course translations"

    def __str__(self):
        return f"{self.name} ({self.language})"  # pragma: no cover
