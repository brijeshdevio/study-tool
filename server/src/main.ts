import "dotenv/config";
import express, { type Response, type Request } from "express";
import { pino } from "pino";
import cors from "cors";
import { routes } from "@/routes";

const hosts = process.env.HOSTS_URI as string;
const allowHosts = hosts?.split(" ");

const app = express();
const logger = pino();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: allowHosts,
    credentials: true,
  })
);

app.get("/", (_: Request, res: Response) => {
  res.send("Welcome to Study Tool AI");
});

app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
