from django.urls import path
from .views import WalletDetailView, TransactionListView, DiscountListView, TransferView, UserSearchView, RedeemDiscountView

urlpatterns = [
    path('balance/', WalletDetailView.as_view(), name='wallet_balance'),
    path('transactions/', TransactionListView.as_view(), name='transaction_history'),
    path('discounts/', DiscountListView.as_view(), name='discount_list'),
    path('discounts/<int:pk>/redeem/', RedeemDiscountView.as_view(), name='redeem_discount'),
    path('transfer/', TransferView.as_view(), name='wallet_transfer'),
    path('search-users/', UserSearchView.as_view(), name='user_search'),
]
