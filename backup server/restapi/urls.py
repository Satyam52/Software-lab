from django.urls import path

from .views import CyclesApiView, CycleApiView, BidApiView, CountCyleApiView

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("auctions", CyclesApiView.as_view(), name='all'),
    path("auction/<id>/", CycleApiView.as_view(), name='cycle'),
    path("paginate", CountCyleApiView.as_view(), name='paginate'),
    path("bid", BidApiView.as_view(), name='bid')
]
