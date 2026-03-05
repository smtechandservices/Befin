from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'name', 'description', 'age_req', 'genre', 'url', 'game_banner', 'game_logo', 'is_live', 'created_at']
