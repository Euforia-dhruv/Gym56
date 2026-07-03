"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  ProfileUpdateSchema,
  IdParamSchema,
  type ProfileUpdateInput,
} from "@/types/api";

// ─── Helpers ────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");
  const role = user.user_metadata?.user_role;
  if (role !== "admin") throw new Error("Forbidden: admin role required");
  return user;
}

// ─── List members (admin only) ───────────────────────────────────────────────

export async function getMembers() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, subscriptions:user_id(id, plan_id, starts_at, expires_at, payment_status, plan:plan_id(name))")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMemberById(id: string) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, subscriptions:user_id(id, plan_id, starts_at, expires_at, payment_status, plan:plan_id(*))")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Update member profile (admin only) ──────────────────────────────────────

export async function updateMemberProfile(
  id: string,
  data: ProfileUpdateInput
) {
  await requireAdmin();

  IdParamSchema.parse(id);
  const parsed = ProfileUpdateSchema.parse(data);

  const admin = createSupabaseAdminClient();
  const updateData: Record<string, unknown> = {};

  if (parsed.full_name !== undefined) updateData.full_name = parsed.full_name;
  if (parsed.phone !== undefined) updateData.phone = parsed.phone;

  const { error } = await admin
    .from("profiles")
    .update(updateData)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/members");
}

// ─── Dashboard stats (admin only) ────────────────────────────────────────────

export async function getDashboardStats() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  const [membersResult, equipmentResult, exercisesResult, subsResult, contactResult] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("equipment").select("*", { count: "exact", head: true }).is("deleted_at", null),
      admin.from("exercises").select("*", { count: "exact", head: true }).is("deleted_at", null),
      admin.from("subscriptions").select("*", { count: "exact", head: true }).eq("payment_status", "paid"),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false),
    ]);

  return {
    totalMembers: membersResult.count ?? 0,
    totalEquipment: equipmentResult.count ?? 0,
    totalExercises: exercisesResult.count ?? 0,
    activeSubscriptions: subsResult.count ?? 0,
    unreadMessages: contactResult.count ?? 0,
  };
}
