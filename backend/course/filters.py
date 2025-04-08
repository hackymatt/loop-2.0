import django_filters
from django.db.models import Avg
from .models import Course
from django_filters import rest_framework as filters


class CourseFilter(django_filters.FilterSet):
    levels = filters.BaseInFilter(
        field_name="level__slug", lookup_expr="in"
    )  # Filter by multiple level slugs
    categories = filters.BaseInFilter(
        field_name="category__slug", lookup_expr="in"
    )  # Filter by multiple category slugs
    technologies = filters.BaseInFilter(
        field_name="technology__slug", lookup_expr="in"
    )  # Filter by multiple technology slugs
    rating = filters.NumberFilter(
        method="filter_by_min_rating"
    )  # Filter by minimum average rating

    class Meta:
        model = Course
        fields = ["level", "category", "technology", "rating"]

    def filter_by_min_rating(self, queryset, name, value):
        return queryset.annotate(avg_rating=Avg("reviews__rating")).filter(
            avg_rating__gte=value
        )
