from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Wallet, Transaction, VirtualCard, Discount, RedeemedDiscount
from .serializers import WalletSerializer, TransactionSerializer, DiscountSerializer
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q
from decimal import Decimal
import re

User = get_user_model()

class UserSearchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        
        # Searching usernames that contain the query (case-insensitive) up to 3 results
        # Excluding the current user's own username
        users = User.objects.filter(
            username__icontains=query
        ).exclude(id=request.user.id)[:3]
        
        usernames = [user.username for user in users]
        return Response(usernames)

class WalletDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        if created:
            # If wallet was just created (e.g. for an existing student user), add the reward transaction
            Transaction.objects.create(
                wallet=wallet,
                amount=1000.00,
                transaction_type='reward',
                description='New User Reward'
            )
        
        # Ensure Virtual Card exists
        VirtualCard.objects.get_or_create(wallet=wallet)
        
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)

class TransactionListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        if created:
             Transaction.objects.create(
                wallet=wallet,
                amount=1000.00,
                transaction_type='reward',
                description='New User Reward'
            )
        transactions = wallet.transactions.all().order_by('-timestamp')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class DiscountListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        discounts = Discount.objects.filter(is_active=True)
        serializer = DiscountSerializer(discounts, many=True, context={'request': request})
        return Response(serializer.data)

class TransferView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        identifier = request.data.get('identifier')
        amount = request.data.get('amount')

        if not identifier or not amount:
            return Response({'error': 'Identifier and amount are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount_decimal = Decimal(str(amount))
            if amount_decimal <= 0:
                raise ValueError
        except (ValueError, Exception):
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            sender_wallet = Wallet.objects.select_for_update().get(user=request.user)
            
            if sender_wallet.balance < amount_decimal:
                return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)

            recipient_wallet = None

            # Check if identifier is a 16-digit card number (ignoring spaces)
            clean_identifier = str(identifier).replace(' ', '')
            if re.match(r'^\d{16}$', clean_identifier):
                try:
                    virtual_card = VirtualCard.objects.get(card_number=clean_identifier)
                    recipient_wallet = virtual_card.wallet
                except VirtualCard.DoesNotExist:
                    pass
            
            # If still not found, check by username
            if not recipient_wallet:
                try:
                    recipient_user = User.objects.get(username=identifier)
                    recipient_wallet = Wallet.objects.get(user=recipient_user)
                except (User.DoesNotExist, Wallet.DoesNotExist):
                    return Response({'error': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)

            if sender_wallet == recipient_wallet:
                return Response({'error': 'Cannot transfer to yourself'}, status=status.HTTP_400_BAD_REQUEST)

            # Perform transfer
            sender_wallet.balance -= amount_decimal
            sender_wallet.save()

            recipient_wallet.balance += amount_decimal
            recipient_wallet.save()

            # Create transactions
            Transaction.objects.create(
                wallet=sender_wallet,
                amount=amount_decimal,
                transaction_type='withdrawal',
                description=f'Transfer to {recipient_wallet.user.username}'
            )

            Transaction.objects.create(
                wallet=recipient_wallet,
                amount=amount_decimal,
                transaction_type='deposit',
                description=f'Transfer from {sender_wallet.user.username}'
            )

        return Response({'success': 'Transfer successful'}, status=status.HTTP_200_OK)

class RedeemDiscountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        try:
            discount = Discount.objects.get(pk=pk, is_active=True)
        except Discount.DoesNotExist:
            return Response({'error': 'Discount not found or inactive'}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            wallet, created = Wallet.objects.select_for_update().get_or_create(user=request.user)

            # Check if already redeemed
            if RedeemedDiscount.objects.filter(user=request.user, discount=discount).exists():
                 return Response({'error': 'You have already redeemed this discount', 'code': discount.code}, status=status.HTTP_400_BAD_REQUEST)

            if wallet.balance < discount.coin_cost:
                return Response({'error': f'Insufficient BeFin coins. You need {discount.coin_cost} coins.'}, status=status.HTTP_400_BAD_REQUEST)

            # Deduct balance
            wallet.balance -= discount.coin_cost
            wallet.save()

            # Record redemption
            RedeemedDiscount.objects.create(
                user=request.user,
                discount=discount
            )

            # Create transaction record
            from .models import Transaction
            Transaction.objects.create(
                wallet=wallet,
                amount=discount.coin_cost,
                transaction_type='purchase',
                description=f'Redeemed: {discount.brand_name}'
            )

        return Response({
            'success': 'Discount redeemed successfully!',
            'code': discount.code,
            'new_balance': wallet.balance
        }, status=status.HTTP_200_OK)


