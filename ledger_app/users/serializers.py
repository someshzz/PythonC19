from rest_framework import serializers

from .models import Account, Budget, Category, Transaction, User, PaymentMethod


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "dob",
            "phone_number",
            "default_account",
        ]


class SetDefaultAccountSerializer(serializers.Serializer):
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "user",
            "account_number",
            "ifsc",
            "balance",
            "account_type",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class TransactionCreateSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    from_account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    category = serializers.ChoiceField(choices=Category.choices)
    description = serializers.CharField(required=False, allow_blank=True, default="")
    payment_method = serializers.ChoiceField(choices=PaymentMethod.choices)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "from_account",
            "to_account",
            "amount",
            "category",
            "description",
            "payment_method",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ["id", "user", "category", "amount"]
        read_only_fields = ["id"]
