import { Router, Request, Response } from "express";
import { PrismaClient, Category } from "@prisma/client";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

const BudgetSchema = z.object({
  userId: z.number().int(),
  category: z.nativeEnum(Category),
  amount: z.number().min(0),
});

// GET /api/budgets/
router.get("/", async (_req: Request, res: Response) => {
  const budgets = await prisma.budget.findMany({ include: { user: true } });
  res.json(budgets);
});

// POST /api/budgets/
router.post("/", async (req: Request, res: Response) => {
  const parsed = BudgetSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.format());
    return;
  }
  const budget = await prisma.budget.create({ data: parsed.data });
  res.status(201).json(budget);
});

// GET /api/budgets/:id
router.get("/:id", async (req: Request, res: Response) => {
  const budget = await prisma.budget.findUnique({
    where: { id: req.params.id },
    include: { user: true },
  });
  if (!budget) { res.status(404).json({ detail: "Not found" }); return; }
  res.json(budget);
});

// PUT /api/budgets/:id
router.put("/:id", async (req: Request, res: Response) => {
  const parsed = BudgetSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.format());
    return;
  }
  try {
    const budget = await prisma.budget.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(budget);
  } catch {
    res.status(404).json({ detail: "Not found" });
  }
});

// DELETE /api/budgets/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.budget.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ detail: "Not found" });
  }
});

export default router;
