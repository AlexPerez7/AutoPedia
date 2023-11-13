# usuarios/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=False, help_text="Campo opcional")

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password1", "password2"]


class CustomAuthenticationForm(AuthenticationForm):
    email = forms.EmailField(
        required=False,
        widget=forms.TextInput(attrs={"placeholder": "Correo electrónico"}),
    )
