import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const ALLOWED_REDIRECT_PATHS = ["/", "/dashboard", "/dashboard/profile"];

function isSafeRedirect(destination: string): boolean {
  try {
    const url = new URL(destination, "https://gym56.vercel.app");
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    if (url.hostname !== "gym56.vercel.app" && url.hostname !== "localhost") return false;
    return true;
  } catch {
    return ALLOWED_REDIRECT_PATHS.includes(destination);
  }
}

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const { allowed, retryAfter } = checkRateLimit(ip, 30, 60_000);
  if (!allowed) return rateLimitResponse(retryAfter);

  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  const safeNext = isSafeRedirect(next) ? next : "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
