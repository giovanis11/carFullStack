from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='rentalrequest',
            name='driver_age',
            field=models.PositiveIntegerField(default=18),
            preserve_default=False,
        ),
    ]
