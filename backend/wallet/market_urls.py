from django.urls import path
from .market_views import MarketQuoteView, MarketHistoryView

urlpatterns = [
    path('quote/', MarketQuoteView.as_view(), name='market_quote'),
    path('history/', MarketHistoryView.as_view(), name='market_history'),
]
