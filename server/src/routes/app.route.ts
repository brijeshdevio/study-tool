import { Router } from "express";
import { AppController } from "@/controllers";

const routes = Router();

const appController = new AppController();

routes.use("/ask", appController.handleAsk);

export { routes };
