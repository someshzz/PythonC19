import { Router, Request, Response } from "express";
import { PrismaClient, Category, PaymentMethod } from "@prisma/client";
import { z } from "zod";
import { getPaymentProcessor } from "../payment";

const router = Router();
const prisma = new PrismaClient();

const TransactionCreateSchema = z.object({
  phoneNumber: z.string().max(15),
  fromAccount: z.number().int(),
  amount: z.number().positive(),
  category: z.nativeEnum(Category),
  description: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

// GET /api/transactions/history
router.get("/history", async (req: Request, res: Response) => {
  const { user_id, start_date, end_date } = req.query;

  if (!user_id || !start_date || !end_date) {
    res.status(400).json({ detail: "user_id, start_date, and end_date are required" });
    return;
  }

  const userId = Number(user_id);
  const userAccounts = await prisma.account.findMany({
    where: { userId },
    select: { id: true },
  });
  const accountIds = userAccounts.map((a) => a.id);

  const start = new Date(start_date as string);
  const end = new Date(end_date as string);

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { fromAccountId: { in: accountIds } },
        { toAccountId: { in: accountIds } },
      ],
      createdAt: { gte: start, lte: end },
    },
    include: {
      fromAccount: { include: { user: true } },
      toAccount: { include: { user: true } },
    },
  });

  const accountIdSet = new Set(accountIds);

  const history = transactions.map((txn) => {
    const isDebit = accountIdSet.has(txn.fromAccountId);
    const otherAccount = isDebit ? txn.toAccount : txn.fromAccount;
    return {
      txnId: txn.id,
      receiverName: `${otherAccount.user.firstName} ${otherAccount.user.lastName}`,
      receiverAccountNumber: otherAccount.accountNumber,
      txnDate: txn.createdAt,
      amount: txn.amount,
      status: txn.status,
      txnType: isDebit ? "DEBIT" : "CREDIT",
    };
  });

  res.json(history);
});

// GET /api/transactions/
router.get("/", async (_req: Request, res: Response) => {
  const txns = await prisma.transaction.findMany({
    include: { fromAccount: true, toAccount: true },
  });
  res.json(txns);
});

// POST /api/transactions/
router.post("/", async (req: Request, res: Response) => {
  const parsed = TransactionCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.format());
    return;
  }

  const { phoneNumber, fromAccount: fromAccountId, amount, category, description, paymentMethod } = parsed.data;

  // Resolve receiver by phone number
  const receiver = await prisma.user.findUnique({
    where: { phoneNumber },
    include: { defaultAccount: true },
  });
  if (!receiver) {
    res.status(404).json({ detail: "Receiver not found" });
    return;
  }
  if (!receiver.defaultAccount) {
    res.status(400).json({ detail: "Receiver has no default account set" });
    return;
  }

  const fromAccount = await prisma.account.findUnique({ where: { id: fromAccountId } });
  if (!fromAccount) {
    res.status(404).json({ detail: "Sender account not found" });
    return;
  }

  // Budget check
  const budget = await prisma.budget.findFirst({
    where: { userId: fromAccount.userId, category },
  });
  if (budget) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const userAccounts = await prisma.account.findMany({
      where: { userId: fromAccount.userId },
      select: { id: true },
    });
    const userAccountIds = userAccounts.map((a) => a.id);

    const monthlySpending = await prisma.transaction.aggregate({
      where: {
        fromAccountId: { in: userAccountIds },
        category,
        createdAt: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    });

    const spent = Number(monthlySpending._sum.amount ?? 0);
    if (spent + amount > Number(budget.amount)) {
      res.status(400).json({
        detail: `Budget exceeded for ${category}. Spent: ${spent}, Budget: ${budget.amount}, Requested: ${amount}`,
      });
      return;
    }
  }

  // Process payment
  const processor = getPaymentProcessor(paymentMethod);
  try {
    await processor.pay(amount, fromAccount, receiver.defaultAccount);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment failed";
    res.status(400).json({ detail: message });
    return;
  }

  // Record transaction
  const txn = await prisma.transaction.create({
    data: {
      fromAccountId,
      toAccountId: receiver.defaultAccount.id,
      amount,
      category,
      description: description ?? "",
      paymentMethod,
      status: "COMPLETED",
    },
    include: { fromAccount: true, toAccount: true },
  });

  res.status(201).json(txn);
});

// GET /api/transactions/:id
router.get("/:id", async (req: Request, res: Response) => {
  const txn = await prisma.transaction.findUnique({
    where: { id: req.params.id },
    include: { fromAccount: true, toAccount: true },
  });
  if (!txn) { res.status(404).json({ detail: "Not found" }); return; }
  res.json(txn);
});

export default router;
