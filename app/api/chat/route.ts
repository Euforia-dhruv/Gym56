import { streamText } from "ai";
import { getModel } from "@/lib/ai/providers";
import { AI_COACH_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

function hasApiKey(): boolean {
  return !!process.env.BLUESMINDS_API_KEY;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!hasApiKey()) {
      return new Response(
        JSON.stringify({
          error: "not_connected",
          message: "AI Coach is not connected yet.",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = streamText({
      model: getModel(),
      system: AI_COACH_SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    return result.toTextStreamResponse();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[AI Coach] error:", msg);
    return new Response(
      JSON.stringify({ error: "server_error", message: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
