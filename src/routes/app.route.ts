import { Router } from "express";
import { AppController } from "@/controllers";
import { zodValidation } from "@/middlewares";
import { askQuestionSchema } from "@/schema/app.schema";

const routes = Router();

const appController = new AppController();

routes.use("/ask", zodValidation(askQuestionSchema), appController.handleAsk);

export { routes };
