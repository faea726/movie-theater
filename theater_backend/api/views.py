import json

import requests
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.http import HttpRequest
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from web3 import Web3

from .models import *
from .serializers import *

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
}
abi = requests.get(settings.API_LINK, headers=headers).json()["result"]
min_value = Web3.toWei(settings.MIN_DONATION, "ether")
w3 = Web3(Web3.HTTPProvider(settings.NODE))
print("Blockchain connected:", w3.isConnected())
contract = w3.eth.contract(settings.TOKEN_ADDRESS, abi=abi)


@api_view(["GET", "POST"])
def categories(request: HttpRequest):
    """GET or CREATE categories"""
    match request.method:
        case "GET":
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        case "POST":
            if not request.user.is_staff:
                return Response(
                    {"error": "no permission"}, status=status.HTTP_406_NOT_ACCEPTABLE
                )
            serializer = CategorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "bad request"}, status=status.HTTP_400_BAD_REQUEST
                )


@api_view(["GET"])
def category(request: HttpRequest, id: int):
    """Get all films of a category"""
    try:
        ctg = Category.objects.get(id=id)
    except:
        return Response({"error": "no category"}, status=status.HTTP_404_NOT_FOUND)
    films = Film.objects.filter(categories__in=ctg)
    serializer = FilmSerializer(data=films, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET", "PUT", "DELETE"])
def film(request: HttpRequest, id: int):
    """GET Film data

    Args:
        id (int): film id
    """
    if request.method not in permissions.SAFE_METHODS:
        if not request.user or not request.user.is_staff:
            return Response(
                {"error": "no permission"}, status=status.HTTP_400_BAD_REQUEST
            )

    try:
        film = Film.objects.get(id=id)
    except:
        return Response({"error": "no film"}, status=status.HTTP_204_NO_CONTENT)

    match request.method:
        case "GET":
            serializer = FilmSerializer(film)
            return Response(serializer.data, status=status.HTTP_200_OK)
        case "PUT":
            serializer = FilmSerializer(data=request.data)
            if serializer.is_valid():
                if "name" in serializer.data:
                    film.name = serializer.validated_data["name"]
                if "img" in serializer.data:
                    film.img = serializer.validated_data["img"]
                if "video" in serializer.data:
                    film.video = serializer.validated_data["video"]

                film.save()
                return Response(
                    FilmSerializer(film).data, status=status.HTTP_202_ACCEPTED
                )
            else:
                return Response(
                    {"error": "invalid input"}, status=status.HTTP_400_BAD_REQUEST
                )
        case "DELETE":
            film.delete()
            return Response(
                {"message": f"{film.name} deleted"}, status=status.HTTP_200_OK
            )


@api_view(["GET", "POST"])
def films(request: HttpRequest):
    """GET or CREATE Film"""
    match request.method:
        case "GET":
            films = Film.objects.all()
            serializer = FilmSerializer(films, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        case "POST":
            if not request.user.is_staff:
                return Response(
                    {"error": "no permission"}, status=status.HTTP_406_NOT_ACCEPTABLE
                )
            serializer = FilmSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": f"{serializer.validated_data['name']} created"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "invalid data"}, status=status.HTTP_400_BAD_REQUEST
                )


@api_view(["GET", "PUT"])
@permission_classes([permissions.IsAuthenticated])
def profile(request: HttpRequest):
    """VIEW or EDIT profile"""
    try:
        user = request.auth.user
    except:
        return Response({"error": "invalid"}, status=status.HTTP_400_BAD_REQUEST)

    match request.method:
        case "GET":
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        case "PUT":
            data = request.data
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                if "password" in serializer.data and data.get("password", "") != "":
                    new_password = make_password(data.get("password"))
                    user.password = new_password

                if "email" in serializer.data and data.get("email", "") != "":
                    new_email = data.get("email")
                    user.email = new_email

                if "nickname" in serializer.data and data.get("nickname", "") != "":
                    if user.is_premium:
                        user.nickname = serializer.validated_data["nickname"]
                    else:
                        return Response(
                            {"message": "not premium user"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                if "avatar" in serializer.data and data.get("avatar", "") != "":
                    if user.is_premium:
                        user.avatar = serializer.validated_data["avatar"]
                    else:
                        return Response(
                            {"message": "not premium user"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
            else:
                return Response(
                    {"error": "invalid input"}, status=status.HTTP_400_BAD_REQUEST
                )

            user.save()
            login(request, user)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def comments(request: HttpRequest):
    """CREATE comment"""
    try:
        user = request.auth.user
    except:
        return Response({"error": "not login"}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data
    if "content" in data and "film_id" in data and data["content"] != "":
        try:
            cur_film = Film.objects.get(id=int(data["film_id"]))
            Comment(
                creator=user,
                film=cur_film,
                content=data["content"],
            ).save()
            return Response(FilmSerializer(cur_film).data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"error": "invalid"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "invalid"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def comment(request: HttpRequest, id: int):
    """GET, MODIFY or DELETE comment"""
    try:
        cmt = Comment.objects.get(id=id)
    except:
        return Response(
            {"error": "comment not exist"}, status=status.HTTP_204_NO_CONTENT
        )
    if request.method not in permissions.SAFE_METHODS:
        if not request.user or request.user != cmt.creator:
            return Response(
                {"error": "no permission"}, status=status.HTTP_400_BAD_REQUEST
            )

    match request.method:
        case "GET":
            serializer = CommentSerializer(cmt)
            return Response(serializer.data, status=status.HTTP_200_OK)
        case "PUT":
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                cmt.content = serializer.validated_data["content"]
                cmt.save()
                return Response(CommentSerializer(cmt).data, status=status.HTTP_200_OK)
        case "DELETE":
            cmt.delete()
            return Response({"message": "comment deleted"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def register(request: HttpRequest):
    """New user register"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.validated_data["password"] = make_password(
            serializer.validated_data["password"]
        )
        try:
            serializer.save()
        except:
            return Response(
                {"error": "username already exist"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {
                "message": f"{serializer.validated_data['username']} register successfully"
            },
            status=status.HTTP_201_CREATED,
        )

    else:
        return Response({"error": "invalid input"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def logout_api(request: HttpRequest):
    """Log out"""
    try:
        try:
            logout(request)
        except:
            pass
        request.auth.delete()
    except:
        return Response({"error": "invalid input"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "logged out"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def login_api(request: HttpRequest):
    """Login"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )

        if user:
            try:
                try:
                    login(request, user)
                except Exception as e:
                    print(e)

                token = Token.objects.get(user=user)
            except:
                token = Token.objects.create(user=user)
                token.save()
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "username or password is incorrect!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response({"error": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def donate(request: HttpRequest):
    """Donate control"""
    try:
        user = request.auth.user
    except:
        return Response({"error": "no user"}, status=status.HTTP_404_NOT_FOUND)

    data = json.loads(request.body)
    hash = data.get("hash", "")
    print(hash)

    if hash != "":
        try:
            tx = w3.eth.get_transaction(hash)
            _, decoded_data = contract.decode_function_input(tx["input"])
            print(decoded_data["_value"], min_value)
            if decoded_data["_value"] >= min_value:
                user.is_premium = True
                user.save()
                return Response({"message": "premium"}, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "invalid"}, status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            print(e)
            return Response({"error": "invalid"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "invalid"}, status=status.HTTP_400_BAD_REQUEST)
