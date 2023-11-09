from django.shortcuts import render
from .models import Marca, Modelo


def home(request):
    return render(request, 'autos/home.html')

def lista_marcas(request):
    marcas = Marca.objects.all()
    return render(request, "autos/lista_marcas.html", {"marcas": marcas})


def lista_modelos(request, marca_id):
    modelos = Modelo.objects.filter(marca_id=marca_id)
    return render(request, "autos/lista_modelos.html", {"modelos": modelos})
