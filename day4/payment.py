from abc import ABC, abstractmethod

class Payment(ABC):

  @abstractmethod
  def process_payment(self): # public abstract void processPayment();
    pass

class CardPayment(Payment):

  def process_payment(self):
    print("Card Payment")

class UpiPayment(Payment):

  def process_payment(self):
    print("UPI Payment")

class BankTransferPayment(Payment):
  
  def process_payment(self):
    print("Bank Transfer Payment")

class WalletPayment(Payment):

  def process_payment(self):
    print("Wallet Payment")

class PaymentProcessor:

  # I am expecting a object of Payment class or an object of any class 
  # that is a decendent of Payment class
  def process_payment(self, payment: Payment):
    payment.process_payment()

payment_processor = PaymentProcessor()

card_payment = CardPayment()
upi_payment = UpiPayment()
bank_transfer_payment = BankTransferPayment()
wallet_payment = WalletPayment()

payment_processor.process_payment(card_payment)
payment_processor.process_payment(upi_payment)
payment_processor.process_payment(bank_transfer_payment)
payment_processor.process_payment(wallet_payment)


