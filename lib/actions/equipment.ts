"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  EquipmentCreateSchema,
  EquipmentUpdateSchema,
  IdParamSchema,
  type EquipmentCreateInput,
  type EquipmentUpdateInput,
} from "@/types/api";
import { slugify } from "@/lib/utils";
import type { Equipment } from "@/types";

// ─── Reusable helpers ───────────────────────────────────────────────────────

async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthenticated");
  const role = user.user_metadata?.user_role;
  if (role !== "admin") throw new Error("Forbidden: admin role required");
  return user;
}

// ─── List ───────────────────────────────────────────────────────────────────-

export async function getEquipment() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getEquipmentById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getPublishedEquipment() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getEquipmentBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createEquipment(input: EquipmentCreateInput) {
  const user = await requireAdmin();

  const parsed = EquipmentCreateSchema.parse(input);

  const admin = createSupabaseAdminClient();
  const slug = slugify(parsed.name);

  const { data, error } = await admin
    .from("equipment")
    .insert({
      name: parsed.name,
      slug,
      category: parsed.category,
      description: parsed.description || null,
      quantity: parsed.quantity,
      condition: parsed.condition,
      location: parsed.location || null,
      is_available: parsed.is_available,
      is_published: parsed.is_published,
      difficulty: parsed.difficulty || 'All Levels',
      muscles_trained: parsed.muscles_trained ?? [],
      secondary_muscles: parsed.secondary_muscles ?? [],
      seat_adjustment: parsed.seat_adjustment ?? [],
      common_mistakes: parsed.common_mistakes ?? [],
      maintenance_tips: parsed.maintenance_tips ?? [],
      instructions: parsed.instructions ?? [],
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/equipment");
  revalidatePath("/equipment");
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────

export async function updateEquipment(input: EquipmentUpdateInput) {
  const user = await requireAdmin();

  const parsed = EquipmentUpdateSchema.parse(input);

  if (Object.keys(parsed).length <= 1) {
    throw new Error("No fields to update");
  }

  const admin = createSupabaseAdminClient();
  const updateData: Record<string, unknown> = { updated_by: user.id };

  if (parsed.name !== undefined) {
    updateData.name = parsed.name;
    updateData.slug = slugify(parsed.name);
  }
  if (parsed.category !== undefined) updateData.category = parsed.category;
  if (parsed.description !== undefined) updateData.description = parsed.description || null;
  if (parsed.quantity !== undefined) updateData.quantity = parsed.quantity;
  if (parsed.condition !== undefined) updateData.condition = parsed.condition;
  if (parsed.location !== undefined) updateData.location = parsed.location || null;
  if (parsed.is_available !== undefined) updateData.is_available = parsed.is_available;
  if (parsed.is_published !== undefined) updateData.is_published = parsed.is_published;
  if (parsed.difficulty !== undefined) updateData.difficulty = parsed.difficulty;
  if (parsed.muscles_trained !== undefined) updateData.muscles_trained = parsed.muscles_trained;
  if (parsed.secondary_muscles !== undefined) updateData.secondary_muscles = parsed.secondary_muscles;
  if (parsed.seat_adjustment !== undefined) updateData.seat_adjustment = parsed.seat_adjustment;
  if (parsed.common_mistakes !== undefined) updateData.common_mistakes = parsed.common_mistakes;
  if (parsed.maintenance_tips !== undefined) updateData.maintenance_tips = parsed.maintenance_tips;
  if (parsed.instructions !== undefined) updateData.instructions = parsed.instructions;

  const { data, error } = await admin
    .from("equipment")
    .update(updateData)
    .eq("id", parsed.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/equipment");
  revalidatePath("/equipment");
  return data;
}

// ─── Delete (soft) ──────────────────────────────────────────────────────────

export async function deleteEquipment(id: string) {
  await requireAdmin();
  IdParamSchema.parse(id);

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("equipment")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/equipment");
  revalidatePath("/equipment");
}

// ─── Publish / Unpublish toggle ────────────────────────────────────────────

export async function toggleEquipmentPublish(id: string, isPublished: boolean) {
  await requireAdmin();
  IdParamSchema.parse(id);

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("equipment")
    .update({ is_published: isPublished, updated_by: (await getCurrentUser())?.id })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/equipment");
  revalidatePath("/equipment");
}

// ─── Upload image ───────────────────────────────────────────────────────────

export async function uploadEquipmentImage(
  equipmentId: string,
  formData: FormData
) {
  const user = await requireAdmin();
  IdParamSchema.parse(equipmentId);

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Accepted: JPEG, PNG, WebP");
  }

  // Validate file size (8 MB max)
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("File too large. Max 8 MB");
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${equipmentId}/${Date.now()}.${ext}`;

  const admin = createSupabaseAdminClient();

  // Upload to storage using admin client (bypasses RLS)
  const { error: uploadError } = await admin.storage
    .from("equipment-images")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // Get public URL
  const {
    data: { publicUrl },
  } = admin.storage.from("equipment-images").getPublicUrl(fileName);

  // Save URL in database
  const { error: dbError } = await admin.from("equipment_images").insert({
    equipment_id: equipmentId,
    url: publicUrl,
    alt_text: formData.get("alt_text") as string || null,
    is_primary: formData.get("is_primary") === "true",
  });

  if (dbError) throw new Error(`DB error: ${dbError.message}`);

  // If this is the primary image and equipment doesn't have one, set it
  if (formData.get("is_primary") === "true") {
    await admin
      .from("equipment")
      .update({ primary_image_url: publicUrl, updated_by: user.id })
      .eq("id", equipmentId);
  }

  revalidatePath("/admin/equipment");
  return { publicUrl };
}

// ─── Related equipment ─────────────────────────────────────────────────────

export async function getRelatedEquipment(equipmentId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("equipment_related")
    .select("related_equipment:related_id(*)")
    .eq("equipment_id", equipmentId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data?.map((r) => r.related_equipment as unknown as Equipment) ?? [];
}

// ─── Get equipment images ───────────────────────────────────────────────────

export async function getEquipmentImages(equipmentId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("equipment_images")
    .select("*")
    .eq("equipment_id", equipmentId)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─── Delete image ───────────────────────────────────────────────────────────

export async function deleteEquipmentImage(imageId: string) {
  await requireAdmin();
  IdParamSchema.parse(imageId);

  const admin = createSupabaseAdminClient();

  // Get the image record first
  const { data: image } = await admin
    .from("equipment_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (!image) throw new Error("Image not found");

  // Extract file path from URL
  const url = new URL(image.url);
  const filePath = url.pathname.replace(
    `/storage/v1/object/public/equipment-images/`,
    ""
  );

  // Delete from storage
  await admin.storage.from("equipment-images").remove([filePath]);

  // Delete from database
  const { error } = await admin.from("equipment_images").delete().eq("id", imageId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/equipment");
}
