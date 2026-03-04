from django.contrib import admin
from .models import Game

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'age_req', 'genre', 'url', 'created_at')
    search_fields = ('name', 'genre')
    list_filter = ('genre', 'age_req')
