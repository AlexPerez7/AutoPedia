# usuarios/urls.py
from django.urls import path
from .views import registro, iniciar_sesion, cerrar_sesion

app_name = "usuarios"

urlpatterns = [
    path("registro/", registro, name="registro"),
    path("iniciar_sesion/", iniciar_sesion, name="iniciar_sesion"),
    path("cerrar_sesion/", cerrar_sesion, name="cerrar_sesion"),
]
