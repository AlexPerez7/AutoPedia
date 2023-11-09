from django.urls import path
from . import views

app_name = "autos"

urlpatterns = [
    path("", views.home, name="home"),
    path("marcas/", views.lista_marcas, name="lista_marcas"),
    path("marcas/<int:marca_id>/", views.lista_modelos, name="lista_modelos"),
]
