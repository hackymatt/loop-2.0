from django.db import models
from core.base_model import BaseModel
from const import Language


class CourseCategory(BaseModel):
    slug = models.CharField(unique=True)

    class Meta:
        db_table = "course_category"

    def __str__(self):
        return self.slug  # pragma: no cover


class CourseCategoryTranslation(BaseModel):
    course_category = models.ForeignKey(
        CourseCategory, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField()

    class Meta:
        db_table = "course_category_translation"
        verbose_name_plural = "Course categories"
        unique_together = ("course_category", "language")

    def __str__(self):
        return f"{self.course_category.slug} ({self.language})"  # pragma: no cover
