from django.db import models
from core.base_model import BaseModel
from django.core.exceptions import ValidationError
from const import LessonType, QuizType, Language


class Lesson(BaseModel):
    slug = models.SlugField(unique=True)
    points = models.PositiveIntegerField(default=0)
    type = models.CharField(
        max_length=max(len(choice[0]) for choice in LessonType.choices),
        choices=LessonType.choices,
    )
    active = models.BooleanField(default=False)

    class Meta:
        db_table = "lesson"
        verbose_name_plural = "Lessons"

    def __str__(self):
        return self.slug  # pragma: no cover


class ReadingLesson(BaseModel):
    lesson = models.OneToOneField(
        Lesson, on_delete=models.CASCADE, related_name="reading"
    )

    class Meta:
        db_table = "reading_lesson"
        verbose_name_plural = "Reading lessons"

    def __str__(self):
        return f"Reading: {self.lesson.slug}"  # pragma: no cover

    def clean(self):
        """Ensure only lesson with type=READING can be assigned"""
        if self.lesson.type != LessonType.READING:
            raise ValidationError(
                f"Reading can only be created for {LessonType.READING} lesson."
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class ReadingLessonTranslation(BaseModel):
    lesson = models.ForeignKey(
        ReadingLesson, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField(max_length=255)
    text = models.TextField()

    class Meta:
        db_table = "reading_lesson_translation"
        verbose_name_plural = "Reading lesson translations"

    def __str__(self):
        return f"{self.lesson.lesson.slug} ({self.language})"  # pragma: no cover


class VideoLesson(BaseModel):
    lesson = models.OneToOneField(
        Lesson, on_delete=models.CASCADE, related_name="video"
    )
    video_url = models.URLField()

    class Meta:
        db_table = "video_lesson"
        verbose_name_plural = "Video lessons"

    def __str__(self):
        return f"Video: {self.lesson.slug}"  # pragma: no cover

    def clean(self):
        """Ensure only lesson with type=VIDEO can be assigned"""
        if self.lesson.type != LessonType.VIDEO:
            raise ValidationError(
                f"Video can only be created for {LessonType.VIDEO} lesson."
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class VideoLessonTranslation(BaseModel):
    lesson = models.ForeignKey(
        VideoLesson, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "video_lesson_translation"
        verbose_name_plural = "Video lesson translations"

    def __str__(self):
        return f"{self.lesson.lesson.slug} ({self.language})"  # pragma: no cover


class QuizLesson(BaseModel):
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name="quiz")
    quiz_type = models.CharField(
        max_length=max(len(choice[0]) for choice in QuizType.choices),
        choices=QuizType.choices,
    )

    class Meta:
        db_table = "quiz_lesson"
        verbose_name_plural = "Quiz lessons"

    def __str__(self):
        return f"Quiz: {self.lesson.slug}"  # pragma: no cover

    def clean(self):
        """Ensure only lesson with type=QUIZ can be assigned"""
        if self.lesson.type != LessonType.QUIZ:
            raise ValidationError(
                f"Quiz can only be created for {LessonType.QUIZ} lesson."
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class QuizLessonTranslation(BaseModel):
    lesson = models.ForeignKey(
        QuizLesson, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField(max_length=255)
    questions = models.JSONField()

    class Meta:
        db_table = "quiz_lesson_translation"
        verbose_name_plural = "Quiz lesson translations"

    def __str__(self):
        return f"{self.lesson.lesson.slug} ({self.language})"  # pragma: no cover


class CodingLesson(BaseModel):
    lesson = models.OneToOneField(
        Lesson, on_delete=models.CASCADE, related_name="coding"
    )
    starter_code = models.TextField()
    solution_code = models.TextField()
    penalty_points = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "coding_lesson"
        verbose_name_plural = "Coding lessons"

    def __str__(self):
        return f"Coding: {self.lesson.slug}"  # pragma: no cover

    def clean(self):
        """Ensure only lesson with type=CODING can be assigned"""
        if self.lesson.type != LessonType.CODING:
            raise ValidationError(
                f"Coding can only be created for {LessonType.CODING} lesson."
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class CodingLessonTranslation(BaseModel):
    lesson = models.ForeignKey(
        CodingLesson, on_delete=models.CASCADE, related_name="translations"
    )
    language = models.CharField(
        max_length=max(len(choice[0]) for choice in Language.choices),
        choices=Language.choices,
    )
    name = models.CharField(max_length=255)
    introduction = models.TextField()
    instructions = models.TextField()
    hint = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "coding_lesson_translation"
        verbose_name_plural = "Coding lesson translations"

    def __str__(self):
        return f"{self.lesson.lesson.slug} ({self.language})"  # pragma: no cover
