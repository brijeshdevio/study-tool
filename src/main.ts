import "dotenv/config";
import express, { type Response } from "express";

const app = express();

app.get("/", (_, res: Response) => {
  res.send("Welcome to the StudyTool API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
