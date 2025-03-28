from django.db import models
from core.base_model import BaseModel
from const import Language


class CourseLevel(BaseModel):
    slug = models.CharField(unique=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "course_level"

    def __str__(self):
        return self.slug  # pragma: no cover


class CourseLevelTranslation(BaseModel):
    course_level = models.ForeignKey(
        CourseLevel, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField()

    class Meta:
        db_table = "course_level_translation"
        unique_together = ("course_level", "language")

    def __str__(self):
        return f"{self.course_level.slug} ({self.language})"  # pragma: no cover
