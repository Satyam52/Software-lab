import datetime

from django.db import models


def upload_to(instance, filename):
    return 'images/{dateTime}-{filename}'.format(filename=filename, dateTime=datetime.datetime.now())


class AppUser(models.Model):  # user for our app
    id = models.CharField(max_length=60, null=False, blank=False, primary_key=True)
    name = models.CharField(max_length=60, null=False, blank=False)
    email = models.CharField(max_length=60, null=False, blank=False)
    mobile = models.CharField(max_length=10, null=True, blank=False)


class Cycle(models.Model):  # cycle schema
    id = models.AutoField(verbose_name="id", primary_key=True)
    name = models.CharField(verbose_name="cycleName", max_length=60)
    basePrice = models.PositiveIntegerField(
        verbose_name="basePrice", null=False, blank=True, default=0)
    maxPrice = models.PositiveIntegerField(
        verbose_name="maxPrice", null=False, blank=True, default=0)
    owner = models.CharField(
        max_length=60, verbose_name="owner", null=False, blank=True)
    bidStartTime = models.DateTimeField(null=True, blank=False)
    bidDeadline = models.DateTimeField(
        verbose_name='deadline', null=False, blank=False)
    buyOutPrice = models.PositiveIntegerField(
        verbose_name="buyOutPrice", null=False, blank=True, default=0)
    viewCount = models.PositiveIntegerField(
        verbose_name="viewCount", null=False, blank=True, default=0)
    desc = models.CharField(max_length=500, null=False, blank=False)
    highest_bid = models.IntegerField(null=True)
    state = models.IntegerField(null=False, blank=False, default=-1)
    buyer = models.CharField(max_length=60, null=True, blank=False)
    uuid = models.CharField(max_length=8, null=True, blank=False)
    purchased_amount = models.PositiveIntegerField(null=False, blank=True, default=0)
    user = models.ForeignKey(AppUser, null=False, blank=False, on_delete=models.CASCADE)
    image_1 = models.ImageField(upload_to=upload_to, null=True)
    image_2 = models.ImageField(upload_to=upload_to, null=True)
    image_3 = models.ImageField(upload_to=upload_to, null=True)
    image_4 = models.ImageField(upload_to=upload_to, null=True)
    image_5 = models.ImageField(upload_to=upload_to, null=True)

    def __str__(self):
        return self.name


class Trending(models.Model):
    id = models.AutoField(verbose_name="id", primary_key=True)
    cycle_id = models.IntegerField(null=True)


class New(models.Model):
    id = models.AutoField(verbose_name="id", primary_key=True)
    cycle_id = models.IntegerField(null=True)


class Bid(models.Model):
    id = models.AutoField(verbose_name="id", primary_key=True)
    user = models.ForeignKey(AppUser, null=False, blank=False, on_delete=models.CASCADE)
    cycle = models.ForeignKey(Cycle, null=False, blank=False, on_delete=models.CASCADE)
    bid_price = models.IntegerField(null=False, blank=False)

    def __str__(self):
        return str(self.bid_price)
