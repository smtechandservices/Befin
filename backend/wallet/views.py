from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer

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
