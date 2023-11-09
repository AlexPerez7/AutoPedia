# marcas/views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView,
)
from .models import Marca
from .forms import MarcaForm


class ListaMarcas(ListView):
    model = Marca
    template_name = "marcas/lista_marcas.html"
    context_object_name = "marcas"


class DetalleMarca(DetailView):
    model = Marca
    template_name = "marcas/detalle_marca.html"
    context_object_name = "marca"


@staff_member_required
def crear_marca(request):
    if request.method == "POST":
        form = MarcaForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("marcas:lista_marcas")
    else:
        form = MarcaForm()
    return render(request, "marcas/formulario_marca.html", {"form": form})


@staff_member_required
def editar_marca(request, pk):
    marca = get_object_or_404(Marca, pk=pk)
    if request.method == "POST":
        form = MarcaForm(request.POST, request.FILES, instance=marca)
        if form.is_valid():
            form.save()
            return redirect("marcas:lista_marcas")
    else:
        form = MarcaForm(instance=marca)
    return render(request, "marcas/formulario_marca.html", {"form": form})


@staff_member_required
def eliminar_marca(request, pk):
    marca = get_object_or_404(Marca, pk=pk)
    marca.delete()
    return redirect("marcas:lista_marcas")
