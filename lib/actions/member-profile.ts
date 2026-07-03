"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  ProfileUpdateSchema,
  type ProfileUpdateInput,
} from "@/types/api";

// ─── Get current user's profile ────────────────────────────────────────────

export async function getMyProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return { ...data, email: user.email };
}

// ─── Get current user's subscriptions ──────────────────────────────────────

export async function getMySubscriptions() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plan:plan_id(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── Update own profile ────────────────────────────────────────────────────

export async function updateMyProfile(input: ProfileUpdateInput) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const parsed = ProfileUpdateSchema.parse(input);

  const updateData: Record<string, unknown> = {};
  if (parsed.full_name !== undefined) updateData.full_name = parsed.full_name;
  if (parsed.phone !== undefined) updateData.phone = parsed.phone;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}

// ─── Upload avatar ─────────────────────────────────────────────────────────

export async function uploadMyAvatar(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Accepted: JPEG, PNG, WebP");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File too large. Max 2 MB");
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  // Update profile with avatar URL
  const { error: dbError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (dbError) throw new Error(`DB error: ${dbError.message}`);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { publicUrl };
}
