# Generated by Django 4.1.1 on 2022-10-17 07:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0009_cycle_images_alter_image_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cycle',
            name='images',
        ),
    ]
