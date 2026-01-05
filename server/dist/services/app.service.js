"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const qroq_config_1 = require("@/config/qroq.config");
class AppService {
    ai = qroq_config_1.getGroqChatCompletion;
    constructor() { }
    async ask(prompt) {
        const response = await this.ai(prompt);
        if (typeof response === "string") {
            return JSON.parse(response);
        }
        return response;
    }
}
exports.AppService = AppService;
