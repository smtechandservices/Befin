from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Game, Leaderboard
from .serializers import GameSerializer
from wallet.models import Wallet, Transaction
from decimal import Decimal
from django.db import transaction

from rest_framework.decorators import action
from .serializers import GameSerializer, LeaderboardSerializer, GameTransactionSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'leaderboard']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['get'])
    def leaderboard(self, request, slug=None):
        game = self.get_object()
        # Find the max score for each user who has played this game
        from django.db.models import Max
        top_user_scores = (
            Leaderboard.objects.filter(game=game)
            .values('user__username')
            .annotate(max_score=Max('score'))
            .order_by('-max_score')[:10]
        )
        
        # Format for the response (matching LeaderboardSerializer structure)
        data = [
            {'username': item['user__username'], 'score': item['max_score']}
            for item in top_user_scores
        ]
        return Response(data)

    @action(detail=True, methods=['get'])
    def my_transactions(self, request, slug=None):
        game = self.get_object()
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        # Filter transactions that mention the game name in description
        transactions = wallet.transactions.filter(
            description__icontains=game.name
        ).order_by('-timestamp')[:5]
        serializer = GameTransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class GameAwardView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, slug):
        try:
            game = Game.objects.get(slug=slug)
        except Game.DoesNotExist:
            return Response({'error': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)

        # Dispatch to specific awarding logic based on slug
        if slug == 'azm':
            return self.award_azm(request, game)
        # Add more games here as they are developed
        
        return Response({'error': 'No awarding logic implemented for this game'}, status=status.HTTP_400_BAD_REQUEST)

    def award_azm(self, request, game):
        coins = request.data.get('coins', 0)
        game_score = request.data.get('game_score', 0)

        try:
            # A-Z of Money: Max 100 BFC limit per session
            coins_int = int(coins)
            coins_to_award = min(coins_int, 100)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid coins value'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine transaction details
        transaction_type = 'reward' if coins_to_award >= 0 else 'withdrawal'
        description = f'Reward from game: {game.name}' if coins_to_award >= 0 else f'Penalty from game: {game.name}'
        abs_amount = Decimal(str(abs(coins_to_award)))

        with transaction.atomic():
            wallet, _ = Wallet.objects.select_for_update().get_or_create(user=request.user)
            
            if abs_amount > 0:
                if coins_to_award > 0:
                    wallet.balance += abs_amount
                else:
                    wallet.balance -= abs_amount
                
                wallet.save()

                Transaction.objects.create(
                    wallet=wallet,
                    amount=abs_amount,
                    transaction_type=transaction_type,
                    description=description
                )

            Leaderboard.objects.create(
                user=request.user,
                game=game,
                score=int(game_score)
            )

        return Response({
            'success': 'Wallet updated!',
            'coins_awarded': coins_to_award,
            'source': game.name,
            'new_balance': wallet.balance
        }, status=status.HTTP_200_OK)
