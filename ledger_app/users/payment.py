from abc import ABC, abstractmethod
from decimal import Decimal

from users.models import PaymentMethod


class PaymentProcessor(ABC):
    """Abstract base class for all payment processors."""

    @abstractmethod
    def validate(self, amount: Decimal, from_account, to_account) -> None:
        """Raise ValueError if the payment cannot proceed."""
        ...

    @abstractmethod
    def process(self, amount: Decimal, from_account, to_account) -> dict:
        """Execute the payment and return a result dict with status and metadata."""
        ...

    def pay(self, amount: Decimal, from_account, to_account) -> dict:
        """Template method: validate then process."""
        self.validate(amount, from_account, to_account)
        return self.process(amount, from_account, to_account)


class UPIPaymentProcessor(PaymentProcessor):

    def validate(self, amount: Decimal, from_account, to_account) -> None:
        if amount <= 0:
            raise ValueError("UPI payment amount must be positive.")
        if amount > Decimal("100000"):
            raise ValueError("UPI payments cannot exceed ₹1,00,000 per transaction.")
        if from_account.balance < amount:
            raise ValueError("Insufficient balance for UPI payment.")

    def process(self, amount: Decimal, from_account, to_account) -> dict:
        from_account.balance -= amount
        to_account.balance += amount
        from_account.save(update_fields=["balance"])
        to_account.save(update_fields=["balance"])
        return {
            "status": "COMPLETED",
            "method": "UPI",
            "amount": amount,
            "from_account": from_account.account_number,
            "to_account": to_account.account_number,
        }


class CreditCardPaymentProcessor(PaymentProcessor):
    TRANSACTION_FEE_PERCENT = Decimal("0.02")  # 2% processing fee

    def validate(self, amount: Decimal, from_account, to_account) -> None:
        if amount <= 0:
            raise ValueError("Credit card payment amount must be positive.")
        total = amount + (amount * self.TRANSACTION_FEE_PERCENT)
        if from_account.balance < total:
            raise ValueError(
                f"Insufficient balance. Amount + 2% fee = ₹{total:.2f} required."
            )

    def process(self, amount: Decimal, from_account, to_account) -> dict:
        fee = amount * self.TRANSACTION_FEE_PERCENT
        total_deducted = amount + fee
        from_account.balance -= total_deducted
        to_account.balance += amount
        from_account.save(update_fields=["balance"])
        to_account.save(update_fields=["balance"])
        return {
            "status": "COMPLETED",
            "method": "CC",
            "amount": amount,
            "fee": fee,
            "total_deducted": total_deducted,
            "from_account": from_account.account_number,
            "to_account": to_account.account_number,
        }


class BankTransferPaymentProcessor(PaymentProcessor):

    def validate(self, amount: Decimal, from_account, to_account) -> None:
        if amount <= 0:
            raise ValueError("Bank transfer amount must be positive.")
        if from_account.ifsc == to_account.ifsc and from_account.account_number == to_account.account_number:
            raise ValueError("Cannot transfer to the same account.")
        if from_account.balance < amount:
            raise ValueError("Insufficient balance for bank transfer.")

    def process(self, amount: Decimal, from_account, to_account) -> dict:
        from_account.balance -= amount
        to_account.balance += amount
        from_account.save(update_fields=["balance"])
        to_account.save(update_fields=["balance"])
        return {
            "status": "COMPLETED",
            "method": "BANK_TRANSFER",
            "amount": amount,
            "from_account": from_account.account_number,
            "to_account": to_account.account_number,
        }


def get_payment_processor(method: PaymentMethod) -> PaymentProcessor:
    """Factory: return the right processor instance for a given payment method string."""
    if (method is PaymentMethod.UPI):
        return UPIPaymentProcessor()
    elif (method is PaymentMethod.CC):
        return CreditCardPaymentProcessor()
    elif (method is PaymentMethod.BANK_TRANSFER):
        return BankTransferPaymentProcessor()
    else:
        raise Exception("Please use a supported Payment method")
