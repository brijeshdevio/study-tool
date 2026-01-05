"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const services_1 = require("@/services");
const appService = new services_1.AppService();
class AppController {
    constructor() { }
    async handleAsk(req, res) {
        const { question } = req.body;
        const response = await appService.ask(question);
        return res.json(response);
    }
}
exports.AppController = AppController;
