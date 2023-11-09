# marcas/forms.py
from django import forms
from .models import Marca


class MarcaForm(forms.ModelForm):
    class Meta:
        model = Marca
        fields = ["nombre", "logo"]
