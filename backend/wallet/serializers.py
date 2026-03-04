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
    is_redeemed = serializers.SerializerMethodField()
    code = serializers.SerializerMethodField()

    class Meta:
        model = Discount
        fields = ('id', 'brand_name', 'percentage', 'coin_cost', 'description', 'category', 'image_url', 'is_redeemed', 'code')

    def get_is_redeemed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from .models import RedeemedDiscount
            return RedeemedDiscount.objects.filter(user=request.user, discount=obj).exists()
        return False

    def get_code(self, obj):
        if self.get_is_redeemed(obj):
            return obj.code
        return None

class WalletSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)
    card = VirtualCardSerializer(read_only=True)

    class Meta:
        model = Wallet
        fields = ('id', 'wallet_number', 'balance', 'updated_at', 'transactions', 'card')
