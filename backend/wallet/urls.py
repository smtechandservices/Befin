from django.urls import path
from .views import WalletDetailView, TransactionListView

urlpatterns = [
    path('balance/', WalletDetailView.as_view(), name='wallet_balance'),
    path('transactions/', TransactionListView.as_view(), name='transaction_history'),
]
