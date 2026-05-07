from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_transferrequest_security_option'),
    ]

    operations = [
        migrations.AddField(
            model_name='transferrequest',
            name='airport_direction',
            field=models.CharField(blank=True, choices=[('from_airport', 'From Airport'), ('to_airport', 'To Airport')], default='', max_length=20),
        ),
        migrations.AddField(
            model_name='transferrequest',
            name='transfer_type',
            field=models.CharField(choices=[('vip', 'VIP Transfer'), ('airport', 'Airport Transfer')], default='vip', max_length=20),
        ),
    ]
