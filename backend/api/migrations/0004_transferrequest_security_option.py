from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_carimage_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='transferrequest',
            name='security_option',
            field=models.CharField(
                choices=[('no', 'No Security'), ('yes', 'Security / Bodyguards')],
                default='no',
                max_length=10,
            ),
        ),
    ]
