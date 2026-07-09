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
        JSON.stringify({ error: "not_connected", message: "AI Coach is not connected yet." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const baseURL = process.env.BLUESMINDS_BASE_URL || "https://integrate.api.nvidia.com/v1";
    const model = process.env.BLUESMINDS_MODEL || "z-ai/glm-5.2";
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

    console.log("Calling NVIDIA...", { baseURL, model });

    const res = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.log("API Error:", res.status, errText);
      return new Response(
        JSON.stringify({ error: "api_error", message: `API returned ${res.status}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("NVIDIA response: streaming started");

    return new Response(res.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log("API Error:", msg);
    return new Response(
      JSON.stringify({ error: "server_error", message: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
