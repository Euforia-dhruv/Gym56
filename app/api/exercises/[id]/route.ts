import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { IdParamSchema } from "@/types/api";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const { allowed, retryAfter } = checkRateLimit(ip, 50, 60_000);
  if (!allowed) return rateLimitResponse(retryAfter);

  const { id } = await params;

  const parsed = IdParamSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid exercise ID" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("exercises")
      .select("id, name, slug, category, muscle_group, equipment_id, equipment_label, difficulty, target_muscles, secondary_muscles, instructions, pro_tips, common_mistakes, safety_tips, gif_url, primary_image_url, sort_order")
      .eq("id", id)
      .is("deleted_at", null)
      .single();
    if (error) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
