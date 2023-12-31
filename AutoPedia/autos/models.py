from django.db import models
from marcas.models import Marca


class Modelo(models.Model):
    nombre = models.CharField(max_length=100)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE)
    generacion = models.CharField(max_length=20, null=True)
    año_inicio = models.PositiveIntegerField(null=True)
    año_fin = models.PositiveIntegerField(null=True, blank=True)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to="autos/images/")
    cilindrada_motor_litros = models.DecimalField(
        max_digits=4, decimal_places=1, null=True, blank=True
    )
    caballos_fuerza = models.PositiveIntegerField(null=True, blank=True)
    torque = models.PositiveIntegerField(null=True, blank=True)
    configuracion_motor = models.CharField(max_length=50, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)  # Agrega este campo

    def __str__(self):
        return f"{self.marca} - {self.nombre} ({self.año_inicio}-{self.año_fin})"
