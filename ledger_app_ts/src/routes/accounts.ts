import { Router, Request, Response } from "express";
import { PrismaClient, AccountType } from "@prisma/client";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

const AccountSchema = z.object({
  userId: z.number().int(),
  accountNumber: z.string().max(30),
  ifsc: z.string().max(11),
  balance: z.number().optional(),
  accountType: z.nativeEnum(AccountType),
});

// GET /api/accounts/
router.get("/", async (_req: Request, res: Response) => {
  const accounts = await prisma.account.findMany({ include: { user: true } });
  res.json(accounts);
});

// POST /api/accounts/
router.post("/", async (req: Request, res: Response) => {
  const parsed = AccountSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.format());
    return;
  }
  const account = await prisma.account.create({ data: parsed.data });
  res.status(201).json(account);
});

// GET /api/accounts/:id
router.get("/:id", async (req: Request, res: Response) => {
  const account = await prisma.account.findUnique({
    where: { id: Number(req.params.id) },
    include: { user: true },
  });
  if (!account) { res.status(404).json({ detail: "Not found" }); return; }
  res.json(account);
});

// PUT /api/accounts/:id
router.put("/:id", async (req: Request, res: Response) => {
  const parsed = AccountSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.format());
    return;
  }
  try {
    const account = await prisma.account.update({
      where: { id: Number(req.params.id) },
      data: parsed.data,
    });
    res.json(account);
  } catch {
    res.status(404).json({ detail: "Not found" });
  }
});

// DELETE /api/accounts/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.account.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ detail: "Not found" });
  }
});

export default router;
