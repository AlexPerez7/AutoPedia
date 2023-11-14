# autos/urls.py
from django.urls import path
from .views import *

app_name = "autos"

urlpatterns = [
    path("", home, name="home"),
    path("modelos/", ListaModelos.as_view(), name="lista_modelos"),
    path("modelos/crear/", crear_modelo, name="crear_modelo"),
    path("modelos/<int:pk>/", DetalleModelo.as_view(), name="detalle_modelo"),
    path("modelos/editar/<int:pk>/", editar_modelo, name="editar_modelo"),
    path("modelos/eliminar/<int:pk>/", eliminar_modelo, name="eliminar_modelo"),
    path("buscar_resultados/", buscar_resultados, name="buscar_resultados"),
]
