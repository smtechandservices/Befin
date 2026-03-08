from django.urls import path
from .views import GameViewSet, GameAwardView

urlpatterns = [
    path('', GameViewSet.as_view({'get': 'list'}), name='game-list'),
    path('<slug:slug>/leaderboard/', GameViewSet.as_view({'get': 'leaderboard'}), name='game-leaderboard'),
    path('<slug:slug>/my_transactions/', GameViewSet.as_view({'get': 'my_transactions'}), name='game-my-transactions'),
    path('<slug:slug>/award/', GameAwardView.as_view(), name='game_award_specific'),
]
