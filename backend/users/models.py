from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

import uuid
import string
import random

def generate_referral_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

class User(AbstractUser):
    email = models.EmailField(unique=True)
    dob = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    referral_code = models.CharField(max_length=20, unique=True, null=True, blank=True)
    referred_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='referrals')
    avatar_type = models.CharField(max_length=10, choices=[('male', 'male'), ('female', 'female')], default='male')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email']

    def save(self, *args, **kwargs):
        if not self.referral_code:
            self.referral_code = generate_referral_code()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
