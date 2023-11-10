# marcas/forms.py
from django import forms
from .models import Marca


class MarcaForm(forms.ModelForm):
    class Meta:
        model = Marca
        fields = [
            "nombre",
            "logo",
            "año_fundación",
            "pais_origen",
            "descripcion",
            "fundador",
        ]

    # Indicar que los campos no son obligatorios
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].required = False
