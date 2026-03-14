from django.contrib import admin
from django.urls import path

from .views import add_two_numbers, multiply_two_numbers

urlpatterns = [
    path('add/', add_two_numbers),
    path('multiply/', multiply_two_numbers)
]