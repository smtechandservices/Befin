from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from django.db.models import Max
from .models import Wallet, Transaction, Leaderboard
from .serializers import WalletSerializer, TransactionSerializer, LeaderboardSerializer

User = get_user_model()

class WalletDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)

class TransactionListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        transactions = Transaction.objects.filter(wallet=wallet).order_by('-timestamp')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class AwardCoinsView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        coins = request.data.get('coins')
        source = request.data.get('source', 'game')
        game_score = request.data.get('game_score')

        if not username or coins is None:
            return Response({'error': 'Missing username or coins'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        wallet, created = Wallet.objects.get_or_create(user=user)
        wallet.balance += int(coins)
        wallet.save()
        
        Transaction.objects.create(
            wallet=wallet,
            amount=coins,
            transaction_type='reward',
            description=f"Earned from {source}"
        )
        
        if game_score is not None:
            Leaderboard.objects.create(
                user=user,
                game_name=source,
                score=game_score
            )
            
        serializer = WalletSerializer(wallet)
        return Response({'success': True, 'wallet': serializer.data})

class LeaderboardView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request):
        game = request.query_params.get('game')
        
        entries = Leaderboard.objects.all()
        if game:
            entries = entries.filter(game_name=game)
            
        leaderboard_data = []
        top_scores = entries.values('user__username', 'game_name').annotate(max_score=Max('score')).order_by('-max_score')[:50]
        
        for item in top_scores:
            leaderboard_data.append({
                'username': item['user__username'],
                'game': item['game_name'],
                'score': item['max_score']
            })
            
        return Response({'leaderboard': leaderboard_data})
