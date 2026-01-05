"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroqChatCompletion = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
const systemPrompt = `
You are a senior software engineer and technical instructor.
Explain concepts clearly for interview preparation.

Return output in strict JSON only.
Explain the following concept for a technical interview:

Topic: {{USER_QUESTION}}

Return JSON with:
- explanation (simple and precise)
- realWorldAnalogy
- codeExample (JavaScript)
- visualExplanation (text-based)
`;
const getGroqChatCompletion = async (prompt) => {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "openai/gpt-oss-20b",
    });
    return response.choices[0].message?.content;
};
exports.getGroqChatCompletion = getGroqChatCompletion;
