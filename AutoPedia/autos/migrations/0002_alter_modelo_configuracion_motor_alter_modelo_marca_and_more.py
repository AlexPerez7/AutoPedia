# Generated by Django 4.2.7 on 2023-11-09 19:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("marcas", "0001_initial"),
        ("autos", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="modelo",
            name="configuracion_motor",
            field=models.CharField(
                blank=True,
                choices=[("V4", "V4"), ("V6", "V6"), ("V8", "V8")],
                max_length=50,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="modelo",
            name="marca",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="marcas.marca"
            ),
        ),
        migrations.DeleteModel(
            name="Marca",
        ),
    ]
