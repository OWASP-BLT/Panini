from django.contrib import admin
from .models import BannedApp


@admin.register(BannedApp)
class BannedAppAdmin(admin.ModelAdmin):
    list_display = ("app_name", "country_name", "country_code", "app_type", "ban_date", "is_active")
    list_filter = ("app_type", "is_active", "ban_date")
    search_fields = ("country_name", "country_code", "app_name", "ban_reason")
    date_hierarchy = "ban_date"
    ordering = ("country_name", "app_name")

    fieldsets = (
        ("App Information", {"fields": ("app_name", "app_type")}),
        ("Country Information", {"fields": ("country_name", "country_code")}),
        ("Ban Details", {"fields": ("ban_reason", "ban_date", "source_url", "is_active")}),
    )
