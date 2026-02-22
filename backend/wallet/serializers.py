from rest_framework import serializers
from .models import Wallet, Transaction, Leaderboard

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'amount', 'transaction_type', 'description', 'timestamp')

class WalletSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ('id', 'wallet_number', 'balance', 'updated_at', 'transactions')

class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ('id', 'username', 'game_name', 'score', 'timestamp')
