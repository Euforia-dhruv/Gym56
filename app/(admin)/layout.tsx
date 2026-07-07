import React from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default async function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    console.log("[AdminLayout] getUser result:", { userId: user?.id, error: userErr?.message });

    if (!user) {
      console.log("[AdminLayout] No user — redirecting to /login");
      redirect("/login");
    }

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("[AdminLayout] profile query:", {
      profile,
      profileRole: profile?.role,
      error: profileErr?.message,
      errorCode: profileErr?.code,
      userId: user.id,
    });

    if (!profile) {
      console.log("[AdminLayout] No profile row found — redirecting to /");
      redirect("/");
    }

    if (profile.role !== "admin") {
      console.log("[AdminLayout] role is not admin — got:", profile.role, "— redirecting to /");
      redirect("/");
    }

    console.log("[AdminLayout] ✅ Access granted for", user.id);
  } catch (e) {
    console.log("[AdminLayout] Exception:", e instanceof Error ? e.message : e);
    redirect("/login");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
