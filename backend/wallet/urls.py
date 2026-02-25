from django.urls import path
from .views import WalletDetailView, TransactionListView, DiscountListView, TransferView, UserSearchView

urlpatterns = [
    path('balance/', WalletDetailView.as_view(), name='wallet_balance'),
    path('transactions/', TransactionListView.as_view(), name='transaction_history'),
    path('discounts/', DiscountListView.as_view(), name='discount_list'),
    path('transfer/', TransferView.as_view(), name='wallet_transfer'),
    path('search-users/', UserSearchView.as_view(), name='user_search'),
]
