import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const sessionResult = await supabase.auth.getSession();

  let profile = null;
  let profileError = null;
  if (user) {
    const result = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = result.data;
    profileError = result.error;
  }

  return NextResponse.json({
    cookies: allCookies.map((c) => ({ name: c.name, value: c.value.substring(0, 20) + "..." })),
    hasUser: !!user,
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    userError: userError?.message ?? null,
    hasSession: !!sessionResult.data.session,
    sessionExpiresAt: sessionResult.data.session?.expires_at ?? null,
    profile,
    profileError: profileError
      ? { message: profileError.message, code: profileError.code, details: profileError.details }
      : null,
  });
}
