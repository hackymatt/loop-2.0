from rest_framework import viewsets
from rest_framework.response import Response
from review.serializers import ReviewSummarySerializer, ReviewSerializer
from .models import Review
from django.db.models import Count
from course.models import Course
from django.shortcuts import get_object_or_404


class ReviewSummaryViewSet(viewsets.ViewSet):
    http_method_names = ["get"]

    def list(self, request, slug=None):
        """
        Get the review summary (rating counts) for a specific course based on the slug.
        """
        course = Course.objects.filter(slug=slug).first()
        if not course:
            return Response({}, status=404)

        # Get the review summary for the course
        review_summary = (
            Review.objects.filter(course=course)
            .values("rating")
            .annotate(count=Count("rating"))
            .order_by("rating")
        )

        # Serialize and return the data
        serializer = ReviewSummarySerializer(review_summary, many=True)
        return Response(serializer.data)



class ReviewViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]  # Only allow GET requests
    serializer_class = ReviewSerializer
    

    def get_queryset(self):
        course_slug = self.kwargs["slug"]
        course = get_object_or_404(Course, slug=course_slug)
        return Review.objects.filter(course=course).order_by("-created_at")
