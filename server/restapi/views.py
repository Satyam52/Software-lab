import json
import requests
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .auth import get_auth_token, is_valid_token
from .models import Cycle, AppUser, Bid, Trending
from .serializer import *
from .auth import handle_user
import uuid

PER_PAGE = 9
AUTH0_DOMAIN = 'bestbid.us.auth0.com'
API_AUDIENCE = 'https://bestbid.us.auth0.com/api/v2/'
ALGORITHMS = ["RS256"]


class CyclesApiView(APIView):  # To get details of all cycles
    def get(self, request, page, *args, **kwargs):
        queryset = Cycle.objects.filter(state__lt=1)[(page - 1) * PER_PAGE:(page) * PER_PAGE]
        serializer_class = CyclesSerializer
        # sort = request.GET.get("sort")
        serializer = serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CycleApiView(APIView):  # CRUD operation on Cycle object

    def get(self, request, id):  # To get specific detail of a cycle
        try:
            queryset = Cycle.objects.get(pk=id)
            serializer_class = CycleSerializer
            cycle = serializer_class(queryset)
            queryset.viewCount += 1
            queryset.save()
            bids = Bid.objects.filter(cycle_id=id)
            resp = cycle.data
            temp = []
            for i in bids:
                usr = AppUser.objects.get(pk=i.user_id)
                temp.append({"bid": i.bid_price, "usr": usr.name})
            resp["bids"] = sorted(temp, key=lambda x: x["bid"])
            return Response(resp, status=status.HTTP_200_OK)
        except Exception as e:
            err = str(e)
            print(err)
        return Response({"err": err}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):  # To add a new cycle entry to table
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
                maxPrice = request.data['maxPrice']
                bidStartTime = request.data['bidStart']

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
                    maxPrice=maxPrice,
                    bidStartTime=bidStartTime,
                    desc=desc,
                    user=user,
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

    def put(self, request, *args, **kwargs):  # To edit existing cycle entry
        user_id, auth = handle_user(request).values()
        if auth:
            try:
                cid = request.data['id']
                cycle = Cycle.objects.get(pk=cid)
                if cycle.user_id == user_id:
                    basePrice = request.data['basePrice']
                    name = request.data['name']
                    buyOutPrice = request.data['buyOutPrice']
                    bidDeadline = request.data['bidDeadline']
                    desc = request.data['desc']
                    maxPrice = request.data['maxPrice']
                    bidStartTime = request.data['bidStart']

                    cycle.name = name
                    cycle.basePrice = basePrice
                    cycle.buyOutPrice = buyOutPrice
                    cycle.bidDeadline = bidDeadline
                    cycle.maxPrice = maxPrice
                    cycle.bidStartTime = bidStartTime
                    cycle.desc = desc
                    cycle.save()
                    return Response({"msg": 'success'}, status=status.HTTP_200_OK)
            except Exception as e:
                err = str(e)
                print(err)
                return Response({"err": err}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"msg": "Invalid user "}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, id, *args, **kwargs):  # delete cycle entry from db
        user_id, auth = handle_user(request).values()
        if auth:
            try:
                cycle = Cycle.objects.get(pk=id)
                if user_id == cycle.user_id and cycle.state == -1:
                    cycle.delete()
                    return Response({"msg": "auction deleted successfully"}, status=status.HTTP_200_OK)
            except Exception as e:
                print(str(e))
        return Response({"error": "Invalid call"}, status=status.HTTP_400_BAD_REQUEST)


class CountCycleApiView(APIView):  # count of active cycle auction to paginate
    def get(self, request):
        cycles = Cycle.objects.filter(state__lt=1)
        return Response(len(cycles), status=status.HTTP_200_OK)


class BidApiView(APIView):  # CRUD operation on each bid per cycle
    def get(self, request):  # GET is not supported by BID end point
        return Response({"error": "Invalid call"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):  # Add new bid for a cycle
        user_id, auth = handle_user(request).values()
        cycle_id = request.data.get("id")
        bid = request.data.get("bid")
        if auth:
            try:
                cycle = Cycle.objects.get(pk=cycle_id)
                user = AppUser.objects.get(pk=user_id)
                if cycle.state != 1 and not cycle.buyer:
                    Bid.objects.create(user=user,
                                       cycle=cycle,
                                       bid_price=bid
                                       )

                    # set up the highest bid price per cycle
                    if cycle.highest_bid:
                        if float(bid) > float(cycle.highest_bid):
                            cycle.highest_bid = bid
                            cycle.save()
                    else:
                        cycle.highest_bid = bid
                        cycle.save()

                    # increment 10% after max bid reached
                    if int(bid) == int(cycle.maxPrice):
                        cycle.maxPrice = int(int(bid) * 1.1)
                        cycle.save()

                    return Response({"msg": "Bid added successfully"}, status=status.HTTP_200_OK)
                return Response({"error": "Auction ended or someone else purchased this bicycle."},
                                status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(str(e))
        return Response({"error": "Invalid call"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, *args, **kwargs):  # delete a particular bid
        user_id, auth = handle_user(request).values()
        if auth:
            try:
                bid = Bid.objects.get(pk=id)
                cycle = Cycle.objects.get(pk=bid.cycle_id)
                if user_id == bid.user_id:
                    bid.delete()
                    if int(bid.bid_price) == int(cycle.highest_bid):
                        bids = Bid.objects.filter(cycle_id=cycle.id)
                        maxBids = max(list(map(lambda x: x.bid_price, bids)))
                        cycle.highest_bid = maxBids
                        cycle.save()

                    return Response({"msg": "Bid deleted successfully"}, status=status.HTTP_200_OK)
            except Exception as e:
                print(str(e))
        return Response({"error": "Invalid call"}, status=status.HTTP_400_BAD_REQUEST)


class BuyOutApiView(APIView):  # Directly purchase cycle before auction starts
    def get(self, request):
        return Response({"error": "Invalid call"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        user_id, auth = handle_user(request).values()
        cycle_id = request.data.get("id")
        if auth:
            try:
                cycle = Cycle.objects.get(pk=cycle_id)
                if cycle.state == -1 and not cycle.buyer:
                    cycle.buyer = user_id
                    cycle.uuid = str(uuid.uuid4())[0:8]
                    cycle.state = 1
                    cycle.purchased_amount = cycle.buyOutPrice
                    cycle.save()
                    return Response({"msg": "Successfully buyout"}, status=status.HTTP_200_OK)
                return Response({"error": "Auction ended or someone else purchased this bicycle."},
                                status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(str(e))
        return Response({"error": "Invalid call"}, status=status.HTTP_400_BAD_REQUEST)


class DashboardBids(APIView):  # Show not won/live bid history to user
    def get(self, request, *args, **kwargs):
        user_id, auth = handle_user(request).values()
        if auth:
            try:
                data = []
                bids = Bid.objects.filter(user=user_id)
                for bid in bids:
                    if bid.cycle.buyer != user_id:
                        data.append({"bidId": bid.id,
                                     "id": bid.cycle.id,
                                     "amount": bid.bid_price,
                                     "name": bid.cycle.name,
                                     "bidDeadline": bid.cycle.bidDeadline
                                     })
                return Response(data, status=status.HTTP_200_OK)
            except:
                return Response({"error": "Error fetching Bids."},
                                status=status.HTTP_400_BAD_REQUEST)


class DashboardWonBids(APIView):  # Show successful/won bid history to user
    def get(self, request, *args, **kwargs):
        user_id, auth = handle_user(request).values()
        if auth:
            try:
                data = []
                won = Cycle.objects.filter(buyer=user_id)
                for cycle in won:
                    data.append({
                        "id": cycle.id,
                        "purchased_amount": cycle.purchased_amount,
                        "name": cycle.name,
                        "code": cycle.uuid,
                        "owner_name": cycle.owner,
                        "owner_email": cycle.user.email,
                        "owner_mobile": cycle.user.mobile
                    })
                return Response(data, status=status.HTTP_200_OK)
            except:
                return Response({"error": "Error fetching Bids."},
                                status=status.HTTP_400_BAD_REQUEST)


class DashboardPosts(APIView):  # Show auction created by user
    def get(self, request, *args, **kwargs):
        user_id, auth = handle_user(request).values()
        serializer_class = CycleSerializer
        if auth:
            try:
                query = Cycle.objects.filter(user=user_id)
                cycles = serializer_class(query, many=True)
                resp = []
                for cycle in cycles.data:
                    temp = cycle
                    if temp["buyer"]:
                        buyer = AppUser.objects.get(pk=temp['buyer'])
                        temp['buyer_email'] = buyer.email
                        temp['buyer_mobile'] = buyer.mobile
                        temp['buyer_name'] = buyer.name
                    del temp['buyer']  # protect open id
                    resp.append(temp)
                return Response(resp, status=status.HTTP_200_OK)
            except Exception as e:
                print(str(e))
                return Response({"error": "Error fetching Bids."},
                                status=status.HTTP_400_BAD_REQUEST)


class Fetch(APIView):
    def get(self, request, code):
        user_id, auth = handle_user(request).values()
        if auth:
            try:
                cycle = Cycle.objects.get(uuid=code)
                if cycle.user_id == user_id:
                    data = {
                        "name": cycle.name,
                        "amount": cycle.purchased_amount
                    }
                    return Response(data, status=status.HTTP_200_OK)
            except Exception as e:
                print(str(e))
            return Response({"error": "Invalid verification code"},
                            status=status.HTTP_400_BAD_REQUEST)


class Verify(APIView):
    def get(self, request, code):
        user_id, auth = handle_user(request).values()
        if auth:
            try:
                cycle = Cycle.objects.get(uuid=code)
                if cycle.user_id == user_id and cycle.state != 2:
                    cycle.state = 2
                    cycle.save()
                    return Response("Verified successfully", status=status.HTTP_200_OK)
            except Exception as e:
                print(str(e))
            return Response({"error": "Invalid verification code"},
                            status=status.HTTP_400_BAD_REQUEST)


class Trendings(APIView):  # Endpoint for displaying trending bicyles based on viewcount
    def get(self, request):
        try:
            trend = Trending.objects.all()
            obj_list = []
            for i in trend:
                print(i)
                temp = Cycle.objects.filter(pk=i.cycle_id)
                if len(temp):
                    obj_list.append({
                        "name": temp[0].name,
                        "id": temp[0].id,
                        "image": temp[0].image_1.url if temp[0].image_1 else None
                    })
            return Response(obj_list, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({"error": "Invalid request"},
                            status=status.HTTP_400_BAD_REQUEST)
