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
