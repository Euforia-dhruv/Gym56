import { createOpenAI } from "@ai-sdk/openai";

export function getModel() {
  const baseURL = process.env.BLUESMINDS_BASE_URL || "https://api.bluesminds.com/v1";

  const model = createOpenAI({
    baseURL,
    apiKey: process.env.BLUESMINDS_API_KEY,
  });

  return model(process.env.BLUESMINDS_MODEL || "gpt-4o-mini");
}
