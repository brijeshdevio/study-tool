import { getGroqChatCompletion } from "@/config/qroq.config";

export class AppService {
  private ai = getGroqChatCompletion;
  constructor() {}

  async ask(prompt: string): Promise<string | null> {
    const response = await this.ai(prompt);
    if (typeof response === "string") {
      return JSON.parse(response) as string;
    }
    return response;
  }
}
