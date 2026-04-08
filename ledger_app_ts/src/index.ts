import "dotenv/config";
import express from "express";
import cors from "cors";

import usersRouter from "./routes/users";
import accountsRouter from "./routes/accounts";
import transactionsRouter from "./routes/transactions";
import budgetsRouter from "./routes/budgets";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ],
}));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/budgets", budgetsRouter);

app.listen(PORT, () => {
  console.log(`Ledger API running on http://localhost:${PORT}`);
});

export default app;
