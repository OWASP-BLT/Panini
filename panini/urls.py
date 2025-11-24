from django.urls import path
from .views import BannedAppsView, search_banned_apps

app_name = "panini"

urlpatterns = [
    path("", BannedAppsView.as_view(), name="index"),
    path("search/", search_banned_apps, name="search"),
]
