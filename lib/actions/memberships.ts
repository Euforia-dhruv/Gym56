"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  MembershipPlanCreateSchema,
  MembershipPlanUpdateSchema,
  IdParamSchema,
  type MembershipPlanCreateInput,
  type MembershipPlanUpdateInput,
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

// ─── List plans (public) ─────────────────────────────────────────────────────

export async function getMembershipPlans() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getActivePlans() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMembershipPlanById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create plan (admin) ─────────────────────────────────────────────────────

export async function createMembershipPlan(input: MembershipPlanCreateInput) {
  await requireAdmin();

  const parsed = MembershipPlanCreateSchema.parse(input);
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from("membership_plans")
    .insert({
      name: parsed.name,
      duration_months: parsed.duration_months,
      price_minor: parsed.price_minor,
      savings_label: parsed.savings_label || null,
      is_featured: parsed.is_featured,
      is_active: parsed.is_active,
      sort_order: parsed.sort_order,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/memberships");
  return data;
}

// ─── Update plan (admin) ─────────────────────────────────────────────────────

export async function updateMembershipPlan(input: MembershipPlanUpdateInput) {
  await requireAdmin();

  const parsed = MembershipPlanUpdateSchema.parse(input);

  if (Object.keys(parsed).length <= 1) {
    throw new Error("No fields to update");
  }

  const admin = createSupabaseAdminClient();
  const updateData: Record<string, unknown> = {};

  if (parsed.name !== undefined) updateData.name = parsed.name;
  if (parsed.duration_months !== undefined) updateData.duration_months = parsed.duration_months;
  if (parsed.price_minor !== undefined) updateData.price_minor = parsed.price_minor;
  if (parsed.savings_label !== undefined) updateData.savings_label = parsed.savings_label || null;
  if (parsed.is_featured !== undefined) updateData.is_featured = parsed.is_featured;
  if (parsed.is_active !== undefined) updateData.is_active = parsed.is_active;
  if (parsed.sort_order !== undefined) updateData.sort_order = parsed.sort_order;

  const { data, error } = await admin
    .from("membership_plans")
    .update(updateData)
    .eq("id", parsed.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/memberships");
  return data;
}

// ─── Delete plan (admin) ─────────────────────────────────────────────────────

export async function deleteMembershipPlan(id: string) {
  await requireAdmin();
  IdParamSchema.parse(id);

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("membership_plans")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/memberships");
}

// ─── Subscriptions (admin only) ──────────────────────────────────────────────

export async function getSubscriptions() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plan:plan_id(*), profile:user_id(id, full_name, email)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSubscriptionCounts() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const plans = await getMembershipPlans();

  const counts: Record<string, number> = {};
  for (const plan of plans) {
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", plan.id)
      .eq("payment_status", "paid");

    counts[plan.id] = count ?? 0;
  }

  return counts;
}
