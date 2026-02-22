from rest_framework import serializers
from .models import Wallet, Transaction, Leaderboard, VirtualCard, Goal

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'amount', 'transaction_type', 'description', 'timestamp')

class VirtualCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualCard
        fields = ('card_number', 'cvv', 'expiry_date')

class WalletSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)
    card = VirtualCardSerializer(read_only=True)

    class Meta:
        model = Wallet
        fields = ('id', 'wallet_number', 'balance', 'updated_at', 'transactions', 'card')

class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ('id', 'username', 'game_name', 'score', 'timestamp')

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ('id', 'title', 'target_amount', 'current_amount', 'deadline', 'created_at')
