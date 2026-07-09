import React from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

function isRedirectError(e: unknown): boolean {
  return e instanceof Error && "digest" in e && String(e.digest).startsWith("NEXT_REDIRECT");
}

export default async function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) redirect("/login");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") redirect("/");
  } catch (e) {
    if (isRedirectError(e)) throw e;
    redirect("/login");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
