from datetime import date

from django.db import transaction as db_transaction
from django.db.models import Sum as models_sum
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Account, Budget, Transaction, User
from .payment import get_payment_processor
from .serializers import (
    AccountSerializer,
    BudgetSerializer,
    TransactionCreateSerializer,
    TransactionSerializer,
    UserSerializer,
)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AccountViewSet(ModelViewSet):
    # This is allowing the ModelViewSet to perform a JOIN on user and account table
    queryset = Account.objects.select_related('user').all()
    serializer_class = AccountSerializer


class TransactionViewSet(ModelViewSet):
    queryset = Transaction.objects.select_related('from_account', 'to_account').all()
    serializer_class = TransactionSerializer

    def create(self, request, *args, **kwargs):
        serializer = TransactionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Step 1: Resolve to_account via phone_number
        try:
            # SELCT * FROM users WHERE phone_number=<phone_number>
            receiver = User.objects.get(phone_number=data["phone_number"])
        except User.DoesNotExist:
            return Response(
                {"error": "No user found with the given phone number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        to_account = receiver.default_account
        if to_account is None: # null = None
            return Response(
                {"error": "Receiver has no default account configured."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Step 2: from_account already resolved by serializer
        from_account = data["from_account"]

        # Step 3: Get payment processor
        try:
            processor = get_payment_processor(data["payment_method"])
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Step 4: Budget check for this category this month
        today = date.today()
        budget = Budget.objects.filter(
            user=from_account.user,
            category=data["category"],
        ).first()

        # Budget Found
        if budget is not None:
            f"""
            Checking with following WHERE clause
            1. from_account (Account) but from_account__user (Account's User)

            SELECT * FROM transactions WHERE
                from_account.user = <from_account.user>
            AND category = <category>
            AND created_at.year = <year>
            AND created_at.month = <month>
            AND status = "COMPLETED"
            """
            monthly_transactions = Transaction.objects.filter(
                from_account__user=from_account.user,
                category=data["category"],
                created_at__year=today.year,
                created_at__month=today.month,
                status=Transaction.Status.COMPLETED,
            )

            month_spent = monthly_transactions.aggregate(total=models_sum("amount"))
            if month_spent["total"] is None:
                month_spent = 0
            else:
                month_spent = month_spent["total"]

            if month_spent + data["amount"] > budget.amount:
                return Response(
                    {
                        "error": (
                            f"Budget exceeded for category '{data['category']}'. "
                            f"Budget: ₹{budget.amount}, Spent so far: ₹{month_spent}, "
                            f"Requested: ₹{data['amount']}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Step 5: Process payment atomically
        try:
            with db_transaction.atomic():
                processor.pay(data["amount"], from_account, to_account)
                txn = Transaction.objects.create(
                    from_account=from_account,
                    to_account=to_account,
                    amount=data["amount"],
                    category=data["category"],
                    description=data.get("description", ""),
                    payment_method=data["payment_method"],
                    status=Transaction.Status.COMPLETED,
                )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TransactionSerializer(txn).data, status=status.HTTP_201_CREATED)


class BudgetViewSet(ModelViewSet):
    queryset = Budget.objects.select_related('user').all()
    serializer_class = BudgetSerializer
