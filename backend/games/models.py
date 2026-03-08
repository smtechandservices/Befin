from django.db import models
from django.conf import settings

class Game(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    age_req = models.PositiveIntegerField(null=True, blank=True)
    genre = models.CharField(max_length=100)
    url = models.CharField(max_length=500)
    game_banner = models.CharField(max_length=1000, null=True, blank=True)
    game_logo = models.CharField(max_length=1000, null=True, blank=True)
    is_live = models.BooleanField(default=False)
    slug = models.SlugField(unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']

class Leaderboard(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leaderboard_entries')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='leaderboard')
    score = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"{self.user.username} - {self.game.name}: {self.score}"
