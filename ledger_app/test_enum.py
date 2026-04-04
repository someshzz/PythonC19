from enum import Enum

class AccountType(Enum):
  SAVINGS = "Savings"
  CURRENT = "Current"

account_type = AccountType.CURRENT