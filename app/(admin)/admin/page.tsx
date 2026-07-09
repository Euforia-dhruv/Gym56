import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminOverview from "./AdminOverview";

export const metadata = {
  title: "Admin Panel - Gym 56",
  description: "Manage equipment, exercises, contacts, and site content.",
};

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) redirect("/login?redirectTo=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin" && profile?.role !== "trainer") {
    redirect("/");
  }

  return <AdminOverview user={user} role={profile.role} />;
}