# Generated by Django 4.1.1 on 2022-10-24 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0020_alter_cycle_biddeadline'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cycle',
            name='desc',
            field=models.CharField(max_length=500),
        ),
    ]