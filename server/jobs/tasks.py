from __future__ import absolute_import, unicode_literals
from celery import shared_task
from restapi.models import *
from datetime import datetime
import pytz
import uuid

utc = pytz.UTC


@shared_task()
def update_bidding_state():
    now = datetime.now()  # get the current time
    now = utc.localize(now)
    try:
        cycles = Cycle.objects.filter(state__lt=1)
        for cycle in cycles:
            if now > cycle.bidDeadline:
                cycle.state = 1
                bids = Bid.objects.filter(cycle_id=cycle.id)  # fetch all bids for that cycle
                if bids:
                    maxBid = bids.order_by('-bid_price')[0]  # select the highest bid and respective user detail
                    cycle.buyer = maxBid.user_id
                    cycle.uuid = str(uuid.uuid4())[0:8]
                    cycle.purchased_amount = maxBid.bid_price
                cycle.save()
        return f"Updated Biddings state at {now} GMT\n"
    except Exception as e:
        print(str(e))
        return f"Failed to update Biddings state\n"


@shared_task()
def trending():
    now = datetime.now()
    now = utc.localize(now)
    try:  # selected top 10 active bicycle based on view count
        top_ten_viewed_cycles = Cycle.objects.filter(state__lt=1).order_by('-viewCount')[0:10]
        if len(top_ten_viewed_cycles) > 0:
            Trending.objects.all().delete()
            cycles = []
            for cycle in top_ten_viewed_cycles:
                trend_cycle = Trending(cycle_id=cycle.id)
                cycles.append(trend_cycle)
            Trending.objects.bulk_create(cycles)
        return f"Updated Trending list {now} GMT\n"  # log the task
    except Exception as e:
        print(str(e))
        return f"Failed to update trending list\n"
