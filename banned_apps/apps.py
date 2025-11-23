from django.apps import AppConfig


class BannedAppsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "banned_apps"
    verbose_name = "Banned Applications"
