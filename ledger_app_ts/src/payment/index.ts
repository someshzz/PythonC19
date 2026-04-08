import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

type Account = {
  id: number;
  balance: Decimal;
};

interface PaymentResult {
  status: string;
  [key: string]: unknown;
}

abstract class PaymentProcessor {
  abstract validate(amount: number, fromAccount: Account, toAccount: Account): void;
  abstract process(
    amount: number,
    fromAccount: Account,
    toAccount: Account,
    tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  ): Promise<PaymentResult>;

  async pay(
    amount: number,
    fromAccount: Account,
    toAccount: Account
  ): Promise<PaymentResult> {
    this.validate(amount, fromAccount, toAccount);
    return await prisma.$transaction(async (tx) => {
      return await this.process(amount, fromAccount, toAccount, tx);
    });
  }
}

export class UPIPaymentProcessor extends PaymentProcessor {
  validate(amount: number, fromAccount: Account, toAccount: Account): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    if (amount > 100000) throw new Error("UPI max transaction is ₹1,00,000");
    if (new Decimal(fromAccount.balance).lessThan(amount))
      throw new Error("Insufficient balance");
  }

  async process(
    amount: number,
    fromAccount: Account,
    toAccount: Account,
    tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  ): Promise<PaymentResult> {
    await (tx as PrismaClient).account.update({
      where: { id: fromAccount.id },
      data: { balance: { decrement: amount } },
    });
    await (tx as PrismaClient).account.update({
      where: { id: toAccount.id },
      data: { balance: { increment: amount } },
    });
    return { status: "success", method: "UPI", amount };
  }
}

export class CreditCardPaymentProcessor extends PaymentProcessor {
  private readonly FEE_RATE = 0.02;

  validate(amount: number, fromAccount: Account, toAccount: Account): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    const fee = amount * this.FEE_RATE;
    const total = amount + fee;
    if (new Decimal(fromAccount.balance).lessThan(total))
      throw new Error(`Insufficient balance (amount + 2% fee = ${total})`);
  }

  async process(
    amount: number,
    fromAccount: Account,
    toAccount: Account,
    tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  ): Promise<PaymentResult> {
    const fee = amount * this.FEE_RATE;
    const total = amount + fee;
    await (tx as PrismaClient).account.update({
      where: { id: fromAccount.id },
      data: { balance: { decrement: total } },
    });
    await (tx as PrismaClient).account.update({
      where: { id: toAccount.id },
      data: { balance: { increment: amount } },
    });
    return { status: "success", method: "CC", amount, fee };
  }
}

export class BankTransferPaymentProcessor extends PaymentProcessor {
  validate(amount: number, fromAccount: Account, toAccount: Account): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    if (fromAccount.id === toAccount.id)
      throw new Error("Cannot transfer to the same account");
    if (new Decimal(fromAccount.balance).lessThan(amount))
      throw new Error("Insufficient balance");
  }

  async process(
    amount: number,
    fromAccount: Account,
    toAccount: Account,
    tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
  ): Promise<PaymentResult> {
    await (tx as PrismaClient).account.update({
      where: { id: fromAccount.id },
      data: { balance: { decrement: amount } },
    });
    await (tx as PrismaClient).account.update({
      where: { id: toAccount.id },
      data: { balance: { increment: amount } },
    });
    return { status: "success", method: "BANK_TRANSFER", amount };
  }
}

export function getPaymentProcessor(method: string): PaymentProcessor {
  switch (method) {
    case "UPI":
      return new UPIPaymentProcessor();
    case "CC":
      return new CreditCardPaymentProcessor();
    case "BANK_TRANSFER":
      return new BankTransferPaymentProcessor();
    default:
      throw new Error(`Unsupported payment method: ${method}`);
  }
}
