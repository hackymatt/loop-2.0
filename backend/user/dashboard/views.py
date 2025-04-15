from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from datetime import timedelta
from django.utils import timezone
from course.progress.models import CourseProgress
from course.enrollment.models import CourseEnrollment
from course.serializers import CourseListSerializer
from certificate.models import Certificate
from certificate.serializers import CertificateSerializer


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Get the student progress records for the given student
        course_progress = CourseProgress.objects.filter(student__user=user)

        # Calculate total points for the student
        total_points = course_progress.aggregate(Sum("points"))["points__sum"] or 0

        # Calculate daily streak (consecutive days of learning till today)
        # First, filter completed lessons by the last 30 days (or longer if needed)
        completed_lessons = course_progress.filter(completed_at__isnull=False)

        # Extract just the dates the student completed lessons
        completed_dates = completed_lessons.values_list("completed_at", flat=True)
        completed_dates = set(
            [date.date() for date in completed_dates]
        )  # Get unique dates

        if not completed_dates:
            daily_streak = 0
        else:
            # Sort the dates and count consecutive streaks backwards from today
            sorted_dates = sorted(completed_dates, reverse=True)
            streak = 0
            current_date = timezone.now().date()

            # Count consecutive days of learning starting from today
            for date in sorted_dates:
                if date == current_date:
                    streak += 1
                    current_date -= timedelta(days=1)  # Check previous day
                else:
                    break

            daily_streak = streak

        enrollments = CourseEnrollment.objects.filter(student__user=user).order_by(
            "-created_at"
        )[:4]
        courses = [enrollment.course for enrollment in enrollments]

        certificates = Certificate.objects.filter(student__user=user).order_by(
            "-created_at"
        )[:4]

        # Return the dashboard data
        data = {
            "total_points": total_points,
            "daily_streak": daily_streak,
            "courses": CourseListSerializer(
                courses, many=True, context={"request": request}
            ).data,
            "certificates": CertificateSerializer(
                certificates, many=True, context={"request": request}
            ).data,
        }
        return Response(data, status=status.HTTP_200_OK)
