from django.urls import path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from . import views

schema_view = get_schema_view(
    openapi.Info(
        title="Theater API",
        default_version="v0.1",
        description="API Book for Theater",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(name="Andrew", url="https://github.com/faea726"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    re_path(
        "all",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="swagger-ui",
    ),
    path("categories", views.categories, name="categories"),
    path("categories/<int:id>", views.category, name="category"),
    path("register", views.register, name="register"),
    path("login", views.login_api, name="login"),
    path("logout", views.logout_api, name="logout"),
    path("profile", views.profile, name="profile"),
    path("films", views.films, name="films"),
    path("films/<int:id>", views.film, name="film"),
    path("comments", views.comments, name="comments"),
    path("comments/<int:id>", views.comment, name="comment"),
    path("donate", views.donate, name="donate"),
]
