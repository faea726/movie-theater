from rest_framework import serializers

from .models import *


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=False)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "nickname", "avatar", "is_premium"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    creator = UserSerializer(required=False)

    class Meta:
        model = Comment
        fields = ["id", "creator", "content", "film"]


class FilmSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=False)
    categories = CategorySerializer(required=False, many=True)
    comment_film = CommentSerializer(required=False, many=True)

    class Meta:
        model = Film
        fields = "__all__"
