import "dotenv/config";
import express, { type Response, type Request } from "express";
import { pino } from "pino";
import { routes } from "@/routes";

const app = express();
const logger = pino();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_: Request, res: Response) => {
  res.send("Welcome to Study Tool AI");
});

app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
