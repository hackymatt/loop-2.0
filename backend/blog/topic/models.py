from django.db import models
from core.base_model import BaseModel
from const import Language


class Topic(BaseModel):
    slug = models.SlugField(unique=True)

    class Meta:
        db_table = "blog_topic"
        verbose_name_plural = "Topics"

    def __str__(self):
        return self.slug  # pragma: no cover


class TopicTranslation(BaseModel):
    topic = models.ForeignKey(
        Topic, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField()

    class Meta:
        db_table = "blog_topic_translation"
        verbose_name_plural = "Topic translations"
        unique_together = ("topic", "language")

    def __str__(self):
        return f"{self.topic.slug} ({self.language})"  # pragma: no cover
