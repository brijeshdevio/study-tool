"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const question = zod_1.default
    .string({
    error: "Question is required",
})
    .min(5, "Question must be at least 5 characters long")
    .max(1000, "Question must be at most 1000 characters long");
exports.askQuestionSchema = zod_1.default
    .object({
    question,
})
    .strict();
