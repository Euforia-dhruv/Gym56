"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  ExerciseCreateSchema,
  ExerciseUpdateSchema,
  IdParamSchema,
  type ExerciseCreateInput,
  type ExerciseUpdateInput,
} from "@/types/api";
import { getSeedExerciseBySlug, getSeedRelatedExercises, getSeedExerciseSteps } from "@/lib/data/exercises-seed";
import { getExercisesFromDb, getDbExerciseBySlug, getDbExercisesByEquipment } from "@/lib/data/exercise-loader";
import { slugify } from "@/lib/utils";
import type { Exercise } from "@/types";

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

// ─── List ───────────────────────────────────────────────────────────────────

export async function getExercises() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("*, equipment:equipment_id(name, slug)")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getExerciseById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("*, equipment:equipment_id(name, slug)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getPublishedExercises() {
  const all = getExercisesFromDb();
  return all.filter((ex) => ex.images?.length);
}

export async function getExercisesByEquipment(_equipmentId: string) {
  return getDbExercisesByEquipment(_equipmentId).filter((ex) => ex.images?.length);
}

// ─── Create ─────────────────────────────────────────────────────────────────

export async function createExercise(input: ExerciseCreateInput) {
  const user = await requireAdmin();

  const parsed = ExerciseCreateSchema.parse(input);

  const admin = createSupabaseAdminClient();
  const slug = slugify(parsed.name);

  const { data, error } = await admin
    .from("exercises")
    .insert({
      name: parsed.name,
      slug,
      category: parsed.category,
      muscle_group: parsed.muscle_group || null,
      equipment_id: parsed.equipment_id || null,
      equipment_label: parsed.equipment_label || null,
      difficulty: parsed.difficulty,
      target_muscles: parsed.target_muscles,
      pro_tips: parsed.pro_tips ?? [],
      common_mistakes: parsed.common_mistakes,
      safety_tips: parsed.safety_tips,
      is_published: parsed.is_published,
      secondary_muscles: parsed.secondary_muscles ?? [],
      breathing: parsed.breathing || null,
      variations: parsed.variations ?? [],
      alternatives: parsed.alternatives ?? [],
      progressions: parsed.progressions ?? [],
      regressions: parsed.regressions ?? [],
      beginner_tips: parsed.beginner_tips ?? [],
      gif_url: parsed.gif_url ?? null,
      thumbnail_url: parsed.thumbnail_url ?? null,
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/exercises");
  revalidatePath("/exercises");
  return data;
}

// ─── Update ─────────────────────────────────────────────────────────────────

export async function updateExercise(input: ExerciseUpdateInput) {
  const user = await requireAdmin();

  const parsed = ExerciseUpdateSchema.parse(input);

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
  if (parsed.muscle_group !== undefined) updateData.muscle_group = parsed.muscle_group || null;
  if (parsed.equipment_id !== undefined) updateData.equipment_id = parsed.equipment_id || null;
  if (parsed.equipment_label !== undefined) updateData.equipment_label = parsed.equipment_label || null;
  if (parsed.difficulty !== undefined) updateData.difficulty = parsed.difficulty;
  if (parsed.target_muscles !== undefined) updateData.target_muscles = parsed.target_muscles;
  if (parsed.pro_tips !== undefined) updateData.pro_tips = parsed.pro_tips;
  if (parsed.common_mistakes !== undefined) updateData.common_mistakes = parsed.common_mistakes;
  if (parsed.safety_tips !== undefined) updateData.safety_tips = parsed.safety_tips;
  if (parsed.is_published !== undefined) updateData.is_published = parsed.is_published;
  if (parsed.secondary_muscles !== undefined) updateData.secondary_muscles = parsed.secondary_muscles;
  if (parsed.breathing !== undefined) updateData.breathing = parsed.breathing || null;
  if (parsed.variations !== undefined) updateData.variations = parsed.variations;
  if (parsed.alternatives !== undefined) updateData.alternatives = parsed.alternatives;
  if (parsed.progressions !== undefined) updateData.progressions = parsed.progressions;
  if (parsed.regressions !== undefined) updateData.regressions = parsed.regressions;
  if (parsed.beginner_tips !== undefined) updateData.beginner_tips = parsed.beginner_tips;
  if (parsed.gif_url !== undefined) updateData.gif_url = parsed.gif_url ?? null;
  if (parsed.thumbnail_url !== undefined) updateData.thumbnail_url = parsed.thumbnail_url ?? null;

  const { data, error } = await admin
    .from("exercises")
    .update(updateData)
    .eq("id", parsed.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/exercises");
  revalidatePath("/exercises");
  return data;
}

// ─── Delete (soft) ──────────────────────────────────────────────────────────

export async function deleteExercise(id: string) {
  await requireAdmin();
  IdParamSchema.parse(id);

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("exercises")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/exercises");
  revalidatePath("/exercises");
}

// ─── Toggle publish ─────────────────────────────────────────────────────────

export async function toggleExercisePublish(id: string, isPublished: boolean) {
  await requireAdmin();
  IdParamSchema.parse(id);

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("exercises")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/exercises");
  revalidatePath("/exercises");
}

// ─── Upload image ───────────────────────────────────────────────────────────

export async function uploadExerciseImage(
  exerciseId: string,
  formData: FormData
) {
  await requireAdmin();
  IdParamSchema.parse(exerciseId);

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Accepted: JPEG, PNG, WebP");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("File too large. Max 8 MB");
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${exerciseId}/${Date.now()}.${ext}`;

  const admin = createSupabaseAdminClient();

  const { error: uploadError } = await admin.storage
    .from("exercise-media")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const {
    data: { publicUrl },
  } = admin.storage.from("exercise-media").getPublicUrl(fileName);

  // Update the exercise's primary_image_url
  await admin
    .from("exercises")
    .update({ primary_image_url: publicUrl })
    .eq("id", exerciseId);

  revalidatePath("/admin/exercises");
  return { publicUrl };
}

// ─── Get exercise by slug ──────────────────────────────────────────────────

export async function getExerciseBySlug(slug: string) {
  const dbEx = getDbExerciseBySlug(slug);
  if (dbEx?.images?.length) return dbEx;
  return getSeedExerciseBySlug(slug) || null;
}

// ─── Related exercises ────────────────────────────────────────────────────

export async function getRelatedExercises(exerciseId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("exercise_related")
      .select("related_exercise:related_id(*)")
      .eq("exercise_id", exerciseId)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data?.map((r) => r.related_exercise as unknown as Exercise) ?? [];
  } catch {
    return getSeedRelatedExercises(exerciseId);
  }
}

// ─── Exercise Steps ─────────────────────────────────────────────────────────

export async function getExerciseSteps(exerciseId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("exercise_steps")
      .select("*")
      .eq("exercise_id", exerciseId)
      .order("step_number", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  } catch {
    return getSeedExerciseSteps(exerciseId);
  }
}
