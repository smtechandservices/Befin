from django.urls import path
from .views import WalletDetailView, TransactionListView, AwardCoinsView, LeaderboardView

urlpatterns = [
    path('balance/', WalletDetailView.as_view(), name='wallet_balance'),
    path('transactions/', TransactionListView.as_view(), name='transaction_history'),
    path('award/', AwardCoinsView.as_view(), name='award_coins'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
]
