from rest_framework import serializers

from .models import *


class CyclesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Cycle
        fields = ('id', 'name', 'basePrice', 'bidDeadline', 'owner', 'image_1')


class CycleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Cycle
        fields = ('highest_bid', 'id', 'name', 'basePrice', 'bidDeadline',
                  'buyOutPrice', 'owner', 'viewCount', 'desc', 'image_1', 'image_2', 'image_3', 'image_4', 'image_5',
                  'state')


class BidSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bid
        fields = ('bid_price')
