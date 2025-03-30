from django.db import models
from core.base_model import BaseModel


class CourseTechnology(BaseModel):
    slug = models.CharField(unique=True)
    name = models.CharField()

    class Meta:
        db_table = "course_technology"
        verbose_name_plural = "Course technologies"

    def __str__(self):
        return self.slug  # pragma: no cover
