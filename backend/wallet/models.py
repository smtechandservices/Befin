import uuid
import random
from datetime import timedelta
from django.db import models
from django.conf import settings
from django.utils import timezone

class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    wallet_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Wallet ({self.wallet_number}) - {self.balance}"

def generate_card_number():
    return f"4000 1234 {random.randint(1000, 9999):04d} {random.randint(1000, 9999):04d}"

def generate_cvv():
    return str(random.randint(100, 999))

def generate_expiry():
    now = timezone.now()
    expiry = now + timedelta(days=5*365)
    return expiry.strftime("%m/%y")

class VirtualCard(models.Model):
    wallet = models.OneToOneField(Wallet, on_delete=models.CASCADE, related_name='card')
    card_number = models.CharField(max_length=19, default=generate_card_number)
    cvv = models.CharField(max_length=3, default=generate_cvv)
    expiry_date = models.CharField(max_length=5, default=generate_expiry)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Card for {self.wallet.user.username}"

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('reward', 'Reward'),
        ('purchase', 'Purchase'),
    )
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} for {self.wallet.user.username}"

class Leaderboard(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leaderboard_entries')
    game_name = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"{self.user.username} - {self.game_name} ({self.score})"

class Goal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=100)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.current_amount}/{self.target_amount})"
