from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand

from api.models import CarImage


class Command(BaseCommand):
    help = 'Upload existing local car images to Cloudinary using the configured default storage.'

    def handle(self, *args, **options):
        if not getattr(settings, 'USE_CLOUDINARY', False):
            self.stdout.write(self.style.ERROR('Cloudinary is not configured. Set CLOUDINARY_URL first.'))
            return

        migrated = 0
        skipped = 0

        for car_image in CarImage.objects.all():
            image_field = car_image.image
            image_name = getattr(image_field, 'name', None)
            if not image_name:
                skipped += 1
                continue

            local_path = Path(settings.MEDIA_ROOT) / image_name
            if not local_path.exists():
                skipped += 1
                self.stdout.write(self.style.WARNING(f'Skipping missing local file: {local_path}'))
                continue

            with local_path.open('rb') as image_file:
                car_image.image.save(local_path.name, File(image_file), save=False)

            car_image.save(update_fields=['image'])
            migrated += 1
            self.stdout.write(self.style.SUCCESS(f'Migrated {image_name}'))

        self.stdout.write(
            self.style.SUCCESS(f'Finished media migration. Migrated: {migrated}. Skipped: {skipped}.')
        )
