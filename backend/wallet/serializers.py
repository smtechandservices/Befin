from rest_framework import serializers
from .models import Wallet, Transaction, VirtualCard, Discount

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'amount', 'transaction_type', 'description', 'timestamp')

class VirtualCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualCard
        fields = ('card_number', 'cvv')

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'

class WalletSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)
    card = VirtualCardSerializer(read_only=True)

    class Meta:
        model = Wallet
        fields = ('id', 'wallet_number', 'balance', 'updated_at', 'transactions', 'card')
