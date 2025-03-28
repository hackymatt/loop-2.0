from core.routers import Router
from django.urls import path, include
from .views import CourseTechnologyViewSet
from const import Urls

router = Router(trailing_slash=False)
router.register(
    Urls.COURSE_TECHNOLOGY, CourseTechnologyViewSet, basename="course-technologies"
)

urlpatterns = [
    path("", include(router.urls)),
]
