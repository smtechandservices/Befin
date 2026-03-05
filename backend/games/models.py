from django.db import models

class Game(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    age_req = models.PositiveIntegerField(null=True, blank=True)
    genre = models.CharField(max_length=100)
    url = models.URLField(max_length=500)
    game_banner = models.CharField(max_length=1000, null=True, blank=True)
    game_logo = models.CharField(max_length=1000, null=True, blank=True)
    is_live = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
