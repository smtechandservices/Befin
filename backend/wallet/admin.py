from django.contrib import admin
from .models import Wallet, Transaction, Discount

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ['user', 'wallet_number', 'balance', 'updated_at']
    search_fields = ['user__username', 'user__email', 'wallet_number']

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['wallet', 'amount', 'transaction_type', 'timestamp']
    list_filter = ['transaction_type', 'timestamp']
    search_fields = ['wallet__user__username', 'description']

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ['brand_name', 'percentage', 'coin_cost', 'is_active']
    list_filter = ['is_active', 'category']
    search_fields = ['brand_name', 'code']
