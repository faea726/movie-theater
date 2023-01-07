from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework.authtoken.models import Token


def clear_token():
    """Clear tokens lived longer than live time"""
    Token.objects.filter(
        created__lte=timezone.now() + timedelta(days=settings.TOKEN_LIVE_DAY_TIME)
    ).delete()
    print("cleared expired token")
