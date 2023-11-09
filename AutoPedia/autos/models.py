# autos/models.py
from django.db import models
from marcas.models import Marca  # Importa el modelo de la aplicación "marcas"


class Modelo(models.Model):
    nombre = models.CharField(max_length=100)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE)
    año = models.PositiveIntegerField()
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to="autos/images/")
    cilindrada_motor = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    configuracion_motor_choices = [
        ("V4", "V4"),
        ("V6", "V6"),
        ("V8", "V8"),
        # Agrega más opciones según sea necesario
    ]
    configuracion_motor = models.CharField(
        max_length=50, choices=configuracion_motor_choices, null=True, blank=True
    )

    def __str__(self):
        return f"{self.marca} - {self.nombre} ({self.año})"
