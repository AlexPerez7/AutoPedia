# marcas/urls.py
from django.urls import path
from .views import ListaMarcas, DetalleMarca, crear_marca, editar_marca, eliminar_marca

app_name = "marcas"

urlpatterns = [
    path("lista_marcas/", ListaMarcas.as_view(), name="lista_marcas"),
    path("detalle_marca/<int:pk>/", DetalleMarca.as_view(), name="detalle_marca"),
    path("crear_marca/", crear_marca, name="crear_marca"),
    path("editar_marca/<int:pk>/", editar_marca, name="editar_marca"),
    path("eliminar_marca/<int:pk>/", eliminar_marca, name="eliminar_marca"),
]
