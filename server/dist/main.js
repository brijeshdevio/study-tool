"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const pino_1 = require("pino");
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = require("@/routes");
const middlewares_1 = require("@/middlewares");
const hosts = process.env.HOSTS_URI;
const allowHosts = hosts?.split(" ");
const app = (0, express_1.default)();
const logger = (0, pino_1.pino)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: allowHosts,
    credentials: true,
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
}));
app.get("/", (_, res) => {
    res.send("Welcome to Study Tool AI");
});
app.get("/health", (_, res) => {
    res.send("OK");
});
app.use("/api", routes_1.routes);
app.use(middlewares_1.globalError);
// for development
if (process.env.NODE_ENV === "development") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}
// for vercel
exports.default = app;
