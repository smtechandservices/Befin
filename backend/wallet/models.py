import uuid
import random
from django.db import models
from django.conf import settings
from django.utils import timezone

def generate_card_number():
    return ''.join([str(random.randint(0, 9)) for _ in range(16)])

def generate_cvv():
    return ''.join([str(random.randint(0, 9)) for _ in range(3)])


class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    wallet_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=1000.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Wallet ({self.wallet_number}) - {self.balance}"

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

class VirtualCard(models.Model):
    wallet = models.OneToOneField(Wallet, on_delete=models.CASCADE, related_name='card')
    card_number = models.CharField(max_length=19, default=generate_card_number)
    cvv = models.CharField(max_length=3, default=generate_cvv)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Virtual Card for {self.wallet.user.username}"

class Goal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=100)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.current_amount}/{self.target_amount}"

class Leaderboard(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leaderboard_entries')
    game_name = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"{self.user.username} - {self.game_name}: {self.score}"

class Discount(models.Model):
    brand_name = models.CharField(max_length=100)
    percentage = models.IntegerField(help_text="Discount percentage")
    coin_cost = models.DecimalField(max_digits=12, decimal_places=2, help_text="Cost in BeFin Coins")
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=50, default='General')
    image_url = models.CharField(max_length=255, null=True, blank=True, help_text="Path to image in frontend public folder")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand_name} - {self.percentage}% off"
