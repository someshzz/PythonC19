from rest_framework import serializers

from .models import Account, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "dob"]


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["id", "user", "account_number", "ifsc", "balance", "account_type", "created_at"]
        read_only_fields = ["created_at"]
