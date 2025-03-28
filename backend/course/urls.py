from .level.urls import urlpatterns as level_urls
from .technology.urls import urlpatterns as technology_urls
from django.urls import path, include

course_urlpatterns = level_urls + technology_urls

urlpatterns = [
    path("", include(course_urlpatterns)),
]
