from django.db import models
from core.base_model import BaseModel
from const import Language


class CourseTechnology(BaseModel):
    slug = models.CharField(unique=True)

    class Meta:
        db_table = "course_technology"

    def __str__(self):
        return self.slug  # pragma: no cover


class CourseTechnologyTranslation(BaseModel):
    course_technology = models.ForeignKey(
        CourseTechnology, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField()

    class Meta:
        db_table = "course_technology_translation"
        unique_together = ("course_technology", "language")

    def __str__(self):
        return f"{self.course_technology.slug} ({self.language})"  # pragma: no cover
