# autos/models.py
from django.db import models


class Marca(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Modelo(models.Model):
    nombre = models.CharField(max_length=100)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE)
    año = models.PositiveIntegerField()
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to="autos/images/")
    cilindrada_motor = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    configuracion_motor = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.marca} - {self.nombre} ({self.año})"
