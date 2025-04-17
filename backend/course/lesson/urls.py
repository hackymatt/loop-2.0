from .views import LessonViewSet, LessonSubmitAPIView, LessonAnswerAPIView
from django.urls import path
from const import Urls

urlpatterns = [
    path(
        Urls.LESSON,
        LessonViewSet.as_view({"get": "retrieve"}),
        name="lesson",
    ),
    path(
        Urls.LESSON_SUBMIT,
        LessonSubmitAPIView.as_view(),
        name="lesson-submit",
    ),
    path(
        Urls.LESSON_ANSWER,
        LessonAnswerAPIView.as_view(),
        name="lesson-answer",
    ),
]
