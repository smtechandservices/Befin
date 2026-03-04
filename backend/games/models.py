from django.db import models

class Game(models.Model):
    name = models.CharField(max_length=255)
    age_req = models.PositiveIntegerField(default=0)
    genre = models.CharField(max_length=100)
    url = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
