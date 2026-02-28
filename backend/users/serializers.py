from rest_framework import serializers
from .models import User
from wallet.models import Wallet
from decimal import Decimal

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'dob', 'phone_number', 'first_name', 'last_name', 'referral_code', 'referred_by', 'avatar_type', 'avatar', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at', 'referral_code')

    def get_avatar(self, obj):
        return f"/avatars/{obj.avatar_type}.png"

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(required=False, write_only=True, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'dob', 'phone_number', 'first_name', 'last_name', 'referral_code', 'avatar_type')

    def create(self, validated_data):
        referral_code = validated_data.pop('referral_code', None)
        referrer = None
        
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
            except User.DoesNotExist:
                pass

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            dob=validated_data.get('dob'),
            phone_number=validated_data.get('phone_number'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            referred_by=referrer
        )
        
        # Referral code is generated automatically by the model's save() method

        # Create wallet for the user automatically with a 10,000 coin signup bonus
        # Total bonus = 10,000 (standard) + 100 (if referred)
        bonus_amount = Decimal('10000.00')
        if referrer:
            bonus_amount += Decimal('100.00')
            
        wallet = Wallet.objects.create(user=user, balance=bonus_amount)
        
        from wallet.models import Transaction, VirtualCard
        
        # Log the welcome bonus transaction
        Transaction.objects.create(
            wallet=wallet,
            amount=bonus_amount,
            transaction_type='reward',
            description='Welcome Signup Bonus' + (' (Referral)' if referrer else '')
        )
        
        # Award 100 coins to the referrer
        if referrer:
            referrer_wallet, _ = Wallet.objects.get_or_create(user=referrer)
            referrer_wallet.balance += Decimal('100.00')
            referrer_wallet.save()
            
            Transaction.objects.create(
                wallet=referrer_wallet,
                amount=Decimal('100.00'),
                transaction_type='reward',
                description=f'Referral Bonus - {user.username} joined'
            )
        
        # Generate the user's virtual BeFin card
        VirtualCard.objects.create(wallet=wallet)
        
        return user
