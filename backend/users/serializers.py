from rest_framework import serializers
from .models import User
from wallet.models import Wallet, Transaction

class UserSerializer(serializers.ModelSerializer):
    referral_code = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'dob', 'phone_number', 'first_name', 'last_name', 'created_at', 'updated_at', 'referral_code')
        read_only_fields = ('created_at', 'updated_at')

    def get_referral_code(self, obj):
        from .models import ReferralCode
        code_obj = ReferralCode.objects.filter(referrer=obj).first()
        return code_obj.code if code_obj else None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'dob', 'phone_number', 'first_name', 'last_name', 'referral_code')

    def create(self, validated_data):
        referral_code_str = validated_data.pop('referral_code', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            dob=validated_data.get('dob'),
            phone_number=validated_data.get('phone_number'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Base registration reward: 1000 coins
        bonus = 0
        from .models import ReferralCode
        referrer = None
        
        if referral_code_str:
            try:
                code_obj = ReferralCode.objects.get(code=referral_code_str)
                referrer = code_obj.referrer
                bonus = 100
            except ReferralCode.DoesNotExist:
                pass

        # Create wallet for the user automatically
        wallet = Wallet.objects.create(user=user, balance=1000.00 + bonus)
        
        # 1. Base registration reward
        Transaction.objects.create(
            wallet=wallet,
            amount=1000.00,
            transaction_type='reward',
            description='New User Reward'
        )

        # 2. Referral bonus for the new user
        if bonus:
            Transaction.objects.create(
                wallet=wallet,
                amount=100.00,
                transaction_type='reward',
                description='Referral Bonus'
            )

        # Reward the referrer
        if referrer:
            referrer_wallet, _ = Wallet.objects.get_or_create(user=referrer)
            referrer_wallet.balance = float(referrer_wallet.balance) + 100
            referrer_wallet.save()
            Transaction.objects.create(
                wallet=referrer_wallet,
                amount=100,
                transaction_type='reward',
                description=f'Referral Reward'
            )

        return user
