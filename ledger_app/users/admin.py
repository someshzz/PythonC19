from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "first_name", "last_name", "dob"]
    search_fields = ["first_name", "last_name"]
    ordering = ["last_name", "first_name"]
