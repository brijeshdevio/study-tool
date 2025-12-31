import { AppService } from "@/services";
import type { Request, Response } from "express";

const appService = new AppService();

export class AppController {
  constructor() {}

  async handleAsk(req: Request, res: Response): Promise<Response> {
    const { prompt } = req.body;
    const response = await appService.ask(prompt);
    return res.json(response);
  }
}
