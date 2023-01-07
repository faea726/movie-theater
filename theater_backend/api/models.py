from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    nickname = models.CharField(max_length=64, blank=True)
    avatar = models.ImageField(upload_to="avatars", blank=True)
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username}"


class Film(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    img = models.ImageField(upload_to="images", blank=True)
    video = models.FileField(upload_to="videos", blank=True)
    categories = models.ManyToManyField(
        "Category", blank=True, related_name="film_category"
    )
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name}"


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64, null=False, unique=True)

    def __str__(self):
        return f"{self.name}"


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="comment_creator"
    )
    film = models.ForeignKey(
        "Film", on_delete=models.CASCADE, related_name="comment_film"
    )
    content = models.TextField()

    def __str__(self):
        return f"{self.creator.username} | {self.film.name}"
