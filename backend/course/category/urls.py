from core.routers import Router
from django.urls import path, include
from .views import CourseCategoryViewSet
from const import Urls

router = Router(trailing_slash=False)
router.register(
    Urls.COURSE_CATEGORY, CourseCategoryViewSet, basename="course-categories"
)

urlpatterns = [
    path("", include(router.urls)),
]
