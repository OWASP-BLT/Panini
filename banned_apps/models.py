from django.db import models
from django.utils import timezone

class BannedApp(models.Model):
    APP_TYPES = (
        ("social", "Social Media"),
        ("messaging", "Messaging"),
        ("gaming", "Gaming"),
        ("streaming", "Streaming"),
        ("other", "Other"),
    )

    country_name = models.CharField(max_length=100)
    country_code = models.CharField(max_length=2)  # ISO 2-letter code
    app_name = models.CharField(max_length=100)
    app_type = models.CharField(max_length=20, choices=APP_TYPES)
    ban_reason = models.TextField()
    ban_date = models.DateField(default=timezone.now)
    source_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Banned App"
        verbose_name_plural = "Banned Apps"
        ordering = ["country_name", "app_name"]
        indexes = [
            models.Index(fields=["country_name"]),
            models.Index(fields=["country_code"]),
        ]

    def __str__(self):
        return f"{self.app_name} (Banned in {self.country_name})"


