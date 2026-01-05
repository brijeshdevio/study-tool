"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
const zod_1 = require("zod");
const utils_1 = require("@/utils");
const pino_1 = __importDefault(require("pino"));
const formateZodError = (issues) => {
    return issues.map((issue) => {
        return {
            field: issue.path[0],
            message: issue.message,
        };
    });
};
const errorFormat = (res, err) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.statusCode,
        error: {
            code: err.code,
            message: err.message,
            details: err.details,
        },
    });
};
const globalError = (err, req, res, next) => {
    if (err instanceof utils_1.HttpError) {
        return errorFormat(res, err);
    }
    else if (err instanceof zod_1.ZodError) {
        return errorFormat(res, {
            statusCode: 400,
            code: "BAD_REQUEST",
            message: "Invalid Input",
            details: formateZodError(err.issues),
        });
    }
    (0, pino_1.default)().error(err);
    return errorFormat(res, {
        statusCode: 500,
        code: "SERVER_ERROR",
        message: "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? err.name : undefined,
    });
};
exports.globalError = globalError;
