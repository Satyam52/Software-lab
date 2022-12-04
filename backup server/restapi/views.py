import json
import requests
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .auth import get_auth_token, is_valid_token
from .models import Cycle, AppUser
from .serializer import *
from .auth import handle_user

AUTH0_DOMAIN = 'bestbid.us.auth0.com'
API_AUDIENCE = 'https://bestbid.us.auth0.com/api/v2/'
ALGORITHMS = ["RS256"]


class CyclesApiView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = Cycle.objects.all()
        serializer_class = CyclesSerializer
        # sort = request.GET.get("sort")
        serializer = serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CycleApiView(APIView):

    def get(self, request, id):
        try:
            queryset = Cycle.objects.get(pk=id)
            serializer_class = CycleSerializer
            cycle = serializer_class(queryset)
            queryset.viewCount += 1
            queryset.save()
        except Exception as e:
            err = str(e)
            print(err)
            return Response({"err": err}, status=status.HTTP_400_BAD_REQUEST)
        return Response(cycle.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        parser_classes = (MultiPartParser, FormParser)
        user_id, auth = handle_user(request).values()
        if auth:
            try:
                user = AppUser.objects.get(pk=user_id)
                name = request.data['name']
                basePrice = request.data['basePrice']
                buyOutPrice = request.data['buyOutPrice']
                # owner = request.data['owner']
                bidDeadline = request.data['bidDeadline']
                desc = request.data['desc']

                # extract images
                images = {
                    'image_1': None,
                    'image_2': None,
                    'image_3': None,
                    'image_4': None,
                    'image_5': None
                }
                for key in images.keys():
                    if request.data.get(key):
                        images[key] = request.data.get(key)
                cycle = Cycle.objects.create(
                    name=name,
                    basePrice=basePrice,
                    buyOutPrice=buyOutPrice,
                    owner=user.name,
                    bidDeadline=bidDeadline,
                    desc=desc,
                    user_id=user,
                    image_1=images['image_1'],
                    image_2=images['image_2'],
                    image_3=images['image_3'],
                    image_4=images['image_4'],
                    image_5=images['image_5']
                )
                return Response({"msg": 'success', "res": CycleSerializer(cycle).data}, status=status.HTTP_200_OK)
            except Exception as e:
                err = str(e)
                print(err)
                return Response({"err": err}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"msg": "Invalid user "}, status=status.HTTP_404_NOT_FOUND)


class CountCyleApiView(APIView):
    def get(self, request):
        cycles = Cycle.objects.filter(state__lt=1)
        return Response(len(cycles), status=status.HTTP_200_OK)


class BidApiView(APIView):
    def get(self, request):
        user_id, auth = handle_user(request).values()
        print(user_id, auth)

        # return Response({"error": "Invalid call"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "success"}, status=status.HTTP_200_OK)


    def post(self, request, *args, **kwargs):
        pass
