# Generated by Django 4.2.7 on 2023-11-10 01:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marcas', '0004_marca_pais_origen_alter_marca_logo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='marca',
            old_name='año_creacion',
            new_name='año_fundación',
        ),
    ]
