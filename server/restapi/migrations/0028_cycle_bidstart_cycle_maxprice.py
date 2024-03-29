# Generated by Django 4.1.2 on 2022-11-21 09:11

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('restapi', '0027_cycle_purchased_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='cycle',
            name='bidStart',
            field=models.DateTimeField(verbose_name='deadline', null=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cycle',
            name='maxPrice',
            field=models.PositiveIntegerField(blank=True, default=0, verbose_name='maxPrice'),
        ),
    ]
