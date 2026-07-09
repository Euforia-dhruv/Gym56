import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();
    if (error) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
