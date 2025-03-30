from .level.urls import urlpatterns as level_urls
from .technology.urls import urlpatterns as technology_urls
from .category.urls import urlpatterns as category_urls
from django.urls import path, include

course_urlpatterns = level_urls + technology_urls + category_urls

urlpatterns = [
    path("", include(course_urlpatterns)),
]
