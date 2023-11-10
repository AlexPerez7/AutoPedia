# marcas/models.py
from django.db import models


class Marca(models.Model):
    nombre = models.CharField(max_length=100)
    logo = models.ImageField(upload_to="marcas/logos/")
    año_fundación = models.PositiveIntegerField()
    pais_origen = models.CharField(max_length=50)
    descripcion = models.TextField()
    fundador = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.nombre
