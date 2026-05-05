import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update a superuser from environment variables when provided."

    def handle(self, *args, **options):
        username = os.getenv('DJANGO_SUPERUSER_USERNAME')
        email = os.getenv('DJANGO_SUPERUSER_EMAIL')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

        if not username or not email or not password:
            self.stdout.write(
                self.style.WARNING(
                    'Skipping admin bootstrap. Set DJANGO_SUPERUSER_USERNAME, '
                    'DJANGO_SUPERUSER_EMAIL, and DJANGO_SUPERUSER_PASSWORD to enable it.'
                )
            )
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'is_staff': True,
                'is_superuser': True,
            },
        )

        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        message = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{message} admin user "{username}".'))
