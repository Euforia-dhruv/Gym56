import React from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminLayout } from "@/components/admin/AdminLayout";

function isRedirectError(e: unknown): boolean {
  return e instanceof Error && "digest" in e && String(e.digest).startsWith("NEXT_REDIRECT");
}

async function ensureAdminAccess() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/");
}

export default async function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await ensureAdminAccess();
  } catch (e) {
    if (isRedirectError(e)) throw e;
    redirect("/login");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
