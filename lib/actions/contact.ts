"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  ContactSubmissionSchema,
  IdParamSchema,
  type ContactSubmissionInput,
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

// ─── Submit contact form (public) ──────────────────────────────────────────

export async function submitContactForm(input: ContactSubmissionInput) {
  const parsed = ContactSubmissionSchema.parse(input);
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.name,
    email: parsed.email.toLowerCase(),
    phone: parsed.phone ?? null,
    subject: parsed.subject ?? null,
    message: parsed.message,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/contact");
  return { success: true };
}

// ─── List messages (admin only) ───────────────────────────────────────────

export async function getContactMessages() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getUnreadCount() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

// ─── Mark as read ──────────────────────────────────────────────────────────

export async function markAsRead(id: string) {
  const user = await requireAdmin();
  IdParamSchema.parse(id);

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("contact_submissions")
    .update({
      is_read: true,
      read_by: user.id,
      read_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/contact");
}

export async function markAllAsRead() {
  const user = await requireAdmin();

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("contact_submissions")
    .update({
      is_read: true,
      read_by: user.id,
      read_at: new Date().toISOString(),
    })
    .eq("is_read", false);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/contact");
}

// ─── Delete message ────────────────────────────────────────────────────────

export async function deleteContactMessage(id: string) {
  await requireAdmin();
  IdParamSchema.parse(id);

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/contact");
}
