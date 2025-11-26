from django.http import JsonResponse
from django.views.generic import TemplateView
from ratelimit.decorators import ratelimit

from .models import BannedApp


class BannedAppsView(TemplateView):
    template_name = "panini/panini.html"

@ratelimit(key='ip', rate='20/m', block=True)
def search_banned_apps(request):
    try:
        country = request.GET.get("country", "").strip()
        if not country or len(country) > 100 or not country.replace(" ", "").isalpha():
            return JsonResponse({"apps": []})

        apps = BannedApp.objects.filter(
            country_name__icontains=country,
            is_active=True
        ).values(
            "app_name",
            "app_type",
            "country_name",
            "ban_reason",
            "ban_date",
            "source_url",
        )

        page = int(request.GET.get("page", 1))
        limit = 50
        start = (page - 1) * limit
        end = start + limit

        apps = list(apps_qs.values()[start:end])

        return JsonResponse({"apps": apps, "total": apps_qs.count()})

    except Exception:
        return JsonResponse({"error": "Internal error"}, status=500)

