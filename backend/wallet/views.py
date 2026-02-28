from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from django.db.models import Max
from .models import Wallet, Transaction, Leaderboard, Goal
from .serializers import WalletSerializer, TransactionSerializer, LeaderboardSerializer, GoalSerializer

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
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # Prioritize request.user if authenticated, otherwise use body username
        user = request.user
        username = request.data.get('username')
        
        if not username and not user.is_authenticated:
            return Response({'error': 'Missing identification (username or token)'}, status=status.HTTP_400_BAD_REQUEST)
        
        if username and (not user.is_authenticated or user.username != username):
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': f'User {username} not found'}, status=status.HTTP_404_NOT_FOUND)
            
        coins = request.data.get('coins')
        source = request.data.get('source', 'game')
        game_score = request.data.get('game_score')

        if coins is None:
            return Response({'error': 'Missing coins amount'}, status=status.HTTP_400_BAD_REQUEST)
        
        wallet, created = Wallet.objects.get_or_create(user=user)
        wallet.balance += Decimal(str(coins))
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

class GoalListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        goals = Goal.objects.filter(user=request.user)
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)
        
    def post(self, request):
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoalDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_object(self, pk, user):
        try:
            return Goal.objects.get(pk=pk, user=user)
        except Goal.DoesNotExist:
            return None

    def put(self, request, pk):
        goal = self.get_object(pk, request.user)
        if not goal:
            return Response({'error': 'Goal not found'}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = GoalSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        goal = self.get_object(pk, request.user)
        if not goal:
            return Response({'error': 'Goal not found'}, status=status.HTTP_404_NOT_FOUND)
            
        goal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TradeStockView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        action = request.data.get('action') # 'buy' or 'sell'
        symbol = request.data.get('symbol')
        quantity = request.data.get('quantity')
        price = request.data.get('price')

        if not all([action, symbol, quantity, price]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = Decimal(str(quantity))
            price = Decimal(str(price))
            total_cost = quantity * price
        except (ValueError, TypeError):
            return Response({'error': 'Invalid quantity or price'}, status=status.HTTP_400_BAD_REQUEST)

        wallet, created = Wallet.objects.get_or_create(user=request.user)

        if action == 'buy':
            if wallet.balance < total_cost:
                return Response({'error': 'Insufficient BeCoins'}, status=status.HTTP_400_BAD_REQUEST)
            wallet.balance -= total_cost
            transaction_type = 'purchase'
            description = f"Bought {quantity} shares of {symbol} at ₹{price:.2f}"
        elif action == 'sell':
            wallet.balance += total_cost
            transaction_type = 'deposit'
            description = f"Sold {quantity} shares of {symbol} at ₹{price:.2f}"
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

        wallet.save()

        Transaction.objects.create(
            wallet=wallet,
            amount=total_cost,
            transaction_type=transaction_type,
            description=description
        )

        return Response({'success': True, 'balance': wallet.balance})

class TransferCoinsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        target_username = request.data.get('username')
        amount = request.data.get('amount')
        password = request.data.get('password')

        if not all([target_username, amount, password]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify password
        if not request.user.check_password(password):
            return Response({'error': 'Incorrect password'}, status=status.HTTP_403_FORBIDDEN)

        try:
            amount = Decimal(str(amount))
            if amount <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.username == target_username:
            return Response({'error': 'Cannot transfer to yourself'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = User.objects.get(username=target_username)
        except User.DoesNotExist:
            return Response({'error': 'Recipient user not found'}, status=status.HTTP_404_NOT_FOUND)

        source_wallet, _ = Wallet.objects.get_or_create(user=request.user)
        if source_wallet.balance < amount:
            return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)

        target_wallet, _ = Wallet.objects.get_or_create(user=target_user)

        # Atomic transaction (simplified here)
        source_wallet.balance -= amount
        target_wallet.balance += amount
        
        source_wallet.save()
        target_wallet.save()

        Transaction.objects.create(
            wallet=source_wallet,
            amount=amount,
            transaction_type='withdrawal',
            description=f"Transfer to @{target_username}"
        )

        Transaction.objects.create(
            wallet=target_wallet,
            amount=amount,
            transaction_type='deposit',
            description=f"Received from @{request.user.username}"
        )

        return Response({'success': True, 'new_balance': source_wallet.balance})

class CardDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Password required'}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.check_password(password):
            return Response({'error': 'Incorrect password'}, status=status.HTTP_403_FORBIDDEN)

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        try:
            from .models import VirtualCard
            card = VirtualCard.objects.get(wallet=wallet)
            return Response({
                'card_number': card.card_number,
                'cvv': card.cvv,
                'expiry_date': card.expiry_date
            })
        except Exception:
            return Response({'error': 'Card details not found'}, status=status.HTTP_404_NOT_FOUND)
