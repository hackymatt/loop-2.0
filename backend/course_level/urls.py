from core.routers import Router
from django.urls import path, include
from .views import CourseLevelViewSet
from const import Urls

router = Router(trailing_slash=False)
router.register(Urls.COURSE_LEVELS, CourseLevelViewSet, basename="course-levels")

urlpatterns = [
    path("", include(router.urls)),
]
