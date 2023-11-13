from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    autos_favoritos = models.ManyToManyField("autos.Modelo", blank=True)
    marcas_favoritas = models.ManyToManyField("marcas.Marca", blank=True)

    # Agrega estos campos con related_name para evitar conflictos
    groups = models.ManyToManyField(
        "auth.Group", related_name="custom_user_set", blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission", related_name="custom_user_set", blank=True
    )
