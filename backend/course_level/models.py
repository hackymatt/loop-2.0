from django.db import models
from const import Language


class CourseLevel(models.Model):
    slug = models.CharField(unique=True)

    def __str__(self):
        return self.slug


class CourseLevelTranslation(models.Model):
    course_level = models.ForeignKey(
        CourseLevel, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField()

    class Meta:
        unique_together = ("course_level", "language")

    def __str__(self):
        return f"{self.course_level.slug} ({self.language})"
