import { streamText } from "ai";
import { getModel } from "@/lib/ai/providers";
import { AI_COACH_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

function hasApiKey(): boolean {
  return !!process.env.BLUESMINDS_API_KEY;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const lastMsg = messages[messages.length - 1];
    console.log("User message:", lastMsg?.content);

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

    console.log("Calling BluesMinds...");
    const result = streamText({
      model: getModel(),
      system: AI_COACH_SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });
    console.log("BluesMinds response: streaming started");

    return result.toTextStreamResponse();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log("API Error:", msg);
    return new Response(
      JSON.stringify({ error: "server_error", message: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
