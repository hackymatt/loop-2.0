from .views import PlanListView
from django.urls import path
from const import Urls


urlpatterns = [
    path(Urls.PLAN, PlanListView.as_view(), name="plans"),
]
