from .models import PlanSubscription
from django.utils import timezone
from django.db.models import Q
from plan.utils import get_default_plan


def get_active_user_plan(user):
    subscription = PlanSubscription.objects.filter(
        Q(end_date__gte=timezone.now()) | Q(end_date__isnull=True), student__user=user
    ).first()
    return subscription.plan


def subscribe(student):
    plan = get_default_plan()
    PlanSubscription.objects.create(student=student, plan=plan)
