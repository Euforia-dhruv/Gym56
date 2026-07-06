import React from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getMyProfile } from "@/lib/actions/member-profile";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default async function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getMyProfile();

  if (profile.role !== "admin") redirect("/");

  return <AdminLayout>{children}</AdminLayout>;
}
