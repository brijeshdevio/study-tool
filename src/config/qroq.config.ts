import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

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

export const getGroqChatCompletion = async (
  prompt: string
): Promise<string | null> => {
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
