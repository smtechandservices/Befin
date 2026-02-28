from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import generate_referral_code

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate referral codes for users who do not have one'

    def handle(self, *args, **options):
        users_without_code = User.objects.filter(referral_code__isnull=True) | User.objects.filter(referral_code='')
        count = 0
        
        for user in users_without_code:
            code = generate_referral_code()
            # Ensure uniqueness
            while User.objects.filter(referral_code=code).exists():
                code = generate_referral_code()
            
            user.referral_code = code
            user.save()
            count += 1
            self.stdout.write(self.style.SUCCESS(f'Generated code {code} for user {user.username}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully populated referral codes for {count} users'))
