from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    email = models.EmailField(unique=True)
    dob = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

class ReferralCode(models.Model):
    code = models.CharField(max_length=12, unique=True)
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='generated_codes')
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} (by {self.referrer.username})"
