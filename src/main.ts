import "module-alias/register";
import "dotenv/config";
import express, { type Response, type Request } from "express";
import { pino } from "pino";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { routes } from "@/routes";
import { globalError } from "@/middlewares";

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
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  })
);

app.get("/", (_: Request, res: Response) => {
  res.send("Welcome to Study Tool AI");
});

app.get("/health", (_: Request, res: Response) => {
  res.send("OK");
});

app.use("/api", routes);

app.use(globalError);

// for development
// if (process.env.NODE_ENV === "development") {
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
// }
//
// // for vercel
// export default app;
