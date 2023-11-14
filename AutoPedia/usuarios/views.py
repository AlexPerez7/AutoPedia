# usuarios/views.py
from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, logout
from .forms import (
    CustomUserCreationForm,
    CustomAuthenticationForm,
)  # Importa el nuevo formulario


def registro(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("home")
    else:
        form = CustomUserCreationForm()
    return render(request, "usuarios/registro.html", {"form": form})

#AutoPediaAdmin

def iniciar_sesion(request):
    if request.method == "POST":
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("home")
    else:
        form = CustomAuthenticationForm()
    return render(request, "usuarios/iniciar_sesion.html", {"form": form})


def cerrar_sesion(request):
    logout(request)
    return redirect("home")
