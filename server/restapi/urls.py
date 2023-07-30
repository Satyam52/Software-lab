from django.urls import path, re_path

from .views import CyclesApiView, CycleApiView, BidApiView, CountCycleApiView, BuyOutApiView, \
    DashboardBids, DashboardPosts, DashboardWonBids, Fetch, Verify, Trendings

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("trending", Trendings.as_view()),
    path("fetch/<code>", Fetch.as_view(), name='fetch'),
    path("verify/<code>", Verify.as_view(), name='verify'),
    path("auctions/<int:page>", CyclesApiView.as_view(), name='all'),
    path("auction/<id>/", CycleApiView.as_view(), name='cycle'),
    path("buyout", BuyOutApiView.as_view(), name='cycle'),
    path("paginate", CountCycleApiView.as_view(), name='paginate'),
    path("bid/<id>/", BidApiView.as_view(), name='biddelete'),
    path("bid/", BidApiView.as_view(), name='bid'),
    path("dashboard/bids", DashboardBids.as_view(), name='dashboardBid'),
    path("dashboard/won_bids", DashboardWonBids.as_view(), name='dashboardWonBids'),
    path("dashboard/posts", DashboardPosts.as_view(), name='dashboardBid')
]
