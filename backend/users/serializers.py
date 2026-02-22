from rest_framework import serializers
from .models import User
from wallet.models import Wallet

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'dob', 'phone_number', 'first_name', 'last_name', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'dob', 'phone_number', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            dob=validated_data.get('dob'),
            phone_number=validated_data.get('phone_number'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Create wallet for the user automatically with a 10,000 coin signup bonus
        wallet = Wallet.objects.create(user=user, balance=10000.00)
        
        from wallet.models import Transaction, VirtualCard
        
        # Log the welcome bonus transaction
        Transaction.objects.create(
            wallet=wallet,
            amount=10000.00,
            transaction_type='reward',
            description='Welcome Signup Bonus'
        )
        
        # Generate the user's virtual BeFin card
        VirtualCard.objects.create(wallet=wallet)
        
        return user
