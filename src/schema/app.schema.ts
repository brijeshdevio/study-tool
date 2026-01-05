import zod from "zod";

const question = zod
  .string({
    error: "Question is required",
  })
  .min(5, "Question must be at least 5 characters long")
  .max(1000, "Question must be at most 1000 characters long");

export const askQuestionSchema = zod
  .object({
    question,
  })
  .strict();
