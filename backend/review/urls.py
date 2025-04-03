from .views import ReviewSummaryViewSet, ReviewViewSet
from django.urls import path
from const import Urls

urlpatterns = [
    path(
        Urls.COURSE_REVIEW_SUMMARY,
        ReviewSummaryViewSet.as_view({"get": "list"}),
        name="reviews-summary",
    ),
    path(
        Urls.COURSE_REVIEWS,  
        ReviewViewSet.as_view({"get": "list"}),
        name="course-reviews",
    ),
]
