from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Prefetch
from .models import Plan, PlanOption
from .serializers import PlanSerializer


class PlanListView(APIView):
    def get(self, request):
        plans = Plan.objects.prefetch_related(
            "translations",
            Prefetch(
                "plan_options",
                queryset=PlanOption.objects.select_related("option").prefetch_related(
                    Prefetch("option__translations")
                ),
            ),
        ).all()

        serializer = PlanSerializer(plans, many=True, context={"request": request})
        return Response(serializer.data)
