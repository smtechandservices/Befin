from rest_framework import serializers
from .models import Game, Leaderboard
from wallet.models import Transaction

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'name', 'slug', 'description', 'age_req', 'genre', 'url', 'game_banner', 'game_logo', 'is_live', 'created_at']

class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ['username', 'score', 'timestamp']

class GameTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['amount', 'description', 'timestamp']
