import { createOpenAI } from "@ai-sdk/openai";

export type ProviderType = "openrouter" | "gemini" | "ollama";

export function getModel() {
  const provider = (process.env.AI_PROVIDER || "openrouter") as ProviderType;

  switch (provider) {
    case "openrouter": {
      const openai = createOpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      });
      return openai(process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini");
    }
    case "gemini":
      throw new Error(
        "Gemini provider not yet implemented. Set AI_PROVIDER=openrouter or AI_PROVIDER=ollama to use an available provider."
      );
    case "ollama": {
      const ollama = createOpenAI({
        baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
        apiKey: "ollama",
      });
      return ollama(process.env.OLLAMA_MODEL || "llama3");
    }
    default: {
      const _exhaustive: never = provider;
      throw new Error(`Unknown AI provider: ${_exhaustive}`);
    }
  }
}
