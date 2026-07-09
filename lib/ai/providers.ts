import { createOpenAI } from "@ai-sdk/openai";

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_MODEL = "z-ai/glm-5.2";

export function getModel() {
  const baseURL = process.env.BLUESMINDS_BASE_URL || DEFAULT_BASE_URL;

  const model = createOpenAI({
    baseURL,
    apiKey: process.env.BLUESMINDS_API_KEY,
  });

  return model(process.env.BLUESMINDS_MODEL || DEFAULT_MODEL);
}
