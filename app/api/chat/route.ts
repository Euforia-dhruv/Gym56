import { AI_COACH_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { z } from "zod";

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })).min(1),
});

const DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_MODEL = "z-ai/glm-5.2";

function hasApiKey(): boolean {
  return !!process.env.BLUESMINDS_API_KEY;
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return hostname === "gym56.vercel.app" || hostname === "localhost" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return new Response(
        JSON.stringify({ error: "forbidden", message: "Request from unauthorized origin" }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }

    const ip = getClientIp(req);
    const { allowed, retryAfter } = checkRateLimit(ip, 15, 60_000);
    if (!allowed) return rateLimitResponse(retryAfter);

    const parsed = ChatRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "validation_error", message: "Invalid request format" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { messages } = parsed.data;

    if (!hasApiKey()) {
      return new Response(
        JSON.stringify({ error: "not_connected", message: "AI Coach is not connected yet." }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    const baseURL = process.env.BLUESMINDS_BASE_URL || DEFAULT_BASE_URL;
    const model = process.env.BLUESMINDS_MODEL || DEFAULT_MODEL;
    const apiKey = process.env.BLUESMINDS_API_KEY;

    const systemMsg = { role: "system", content: AI_COACH_SYSTEM_PROMPT };
    const body = {
      model,
      messages: [systemMsg, ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }))],
      stream: true,
    };

    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      await res.text().catch(() => {});
      return new Response(
        JSON.stringify({ error: "api_error", message: "AI service is currently unavailable. Please try again later." }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "server_error", message: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}