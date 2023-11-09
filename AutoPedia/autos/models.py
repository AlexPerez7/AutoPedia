from django.db import models


class Marca(models.Model):
    nombre = models.CharField(max_length=100)


class Modelo(models.Model):
    nombre = models.CharField(max_length=100)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE)
    año = models.PositiveIntegerField()
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to="autos/images/")
