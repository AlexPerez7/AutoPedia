# autos/views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import ListView, DetailView
from .models import Modelo
from .forms import ModeloForm


def home(request):
    return render(request, "principal/home.html")


@staff_member_required
def crear_modelo(request):
    if request.method == "POST":
        form = ModeloForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("autos:lista_modelos")
    else:
        form = ModeloForm()
    return render(request, "autos/formulario_modelo.html", {"form": form})


class ListaModelos(ListView):
    model = Modelo
    template_name = "autos/lista_modelos.html"
    context_object_name = "modelos"


class DetalleModelo(DetailView):
    model = Modelo
    template_name = "autos/detalle_modelo.html"
    context_object_name = "modelo"


@staff_member_required
def editar_modelo(request, pk):
    modelo = get_object_or_404(Modelo, pk=pk)
    if request.method == "POST":
        form = ModeloForm(request.POST, request.FILES, instance=modelo)
        if form.is_valid():
            form.save()
            return redirect("autos:lista_modelos")
    else:
        form = ModeloForm(instance=modelo)
    return render(request, "autos/formulario_modelo.html", {"form": form})


@staff_member_required
def eliminar_modelo(request, pk):
    modelo = get_object_or_404(Modelo, pk=pk)
    modelo.delete()
    return redirect("autos:lista_modelos")
