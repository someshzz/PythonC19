import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

const UserCreateSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  dob: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  phoneNumber: z.string().max(15),
  defaultAccountId: z.number().int().optional().nullable(),
});

const SetDefaultAccountSchema = z.object({
  account: z.number().int(),
});

// GET /api/users/
router.get("/", async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { defaultAccount: true },
  });
  res.json(users);
});

// POST /api/users/
router.post("/", async (req: Request, res: Response) => {
  const parsed = UserCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.format());
    return;
  }
  const { dob, ...rest } = parsed.data;
  const user = await prisma.user.create({
    data: { ...rest, dob: new Date(dob) },
  });
  res.status(201).json(user);
});

// GET /api/users/:id
router.get("/:id", async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    include: { defaultAccount: true, accounts: true },
  });
  if (!user) { res.status(404).json({ detail: "Not found" }); return; }
  res.json(user);
});

// PUT /api/users/:id
router.put("/:id", async (req: Request, res: Response) => {
  const parsed = UserCreateSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.format());
    return;
  }
  const { dob, ...rest } = parsed.data;
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { ...rest, ...(dob ? { dob: new Date(dob) } : {}) },
    });
    res.json(user);
  } catch {
    res.status(404).json({ detail: "Not found" });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ detail: "Not found" });
  }
});

// POST /api/users/:id/set-default-account/
router.post("/:id/set-default-account", async (req: Request, res: Response) => {
  const parsed = SetDefaultAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error.format());
    return;
  }
  const userId = Number(req.params.id);
  const account = await prisma.account.findUnique({
    where: { id: parsed.data.account },
  });
  if (!account) {
    res.status(404).json({ detail: "Account not found" });
    return;
  }
  if (account.userId !== userId) {
    res.status(400).json({ detail: "Account does not belong to this user" });
    return;
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: { defaultAccountId: account.id },
  });
  res.json(user);
});

export default router;
