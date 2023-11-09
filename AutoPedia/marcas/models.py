# marcas/models.py
from django.db import models


class Marca(models.Model):
    nombre = models.CharField(max_length=100)
    logo = models.ImageField(upload_to="marcas/logos/", null=True, blank=True)

    def __str__(self):
        return self.nombre
