import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { pino } from "pino";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the StudyTool API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  pino().info(`Server running on port ${PORT}`);
});
