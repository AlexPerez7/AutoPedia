# autos/forms.py
from django import forms
from .models import Marca, Modelo


class MarcaForm(forms.ModelForm):
    class Meta:
        model = Marca
        fields = ["nombre"]


class ModeloForm(forms.ModelForm):
    class Meta:
        model = Modelo
        fields = [
            "nombre",
            "marca",
            "generacion",
            "año_inicio",
            "año_fin",
            "descripcion",
            "imagen",
            "cilindrada_motor_litros",
            "caballos_fuerza",
            "torque",
            "configuracion_motor",
        ]
