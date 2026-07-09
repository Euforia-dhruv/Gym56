import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase-admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Exercise CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch published exercises from seed data", async () => {
    const { getPublishedExercises } = await import("@/lib/actions/exercises");
    const exercises = await getPublishedExercises();
    expect(Array.isArray(exercises)).toBe(true);
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises[0]).toHaveProperty("name");
    expect(exercises[0]).toHaveProperty("slug");
  });

  it("should fetch an exercise by slug", async () => {
    const { getExerciseBySlug, getPublishedExercises } = await import("@/lib/actions/exercises");
    const all = await getPublishedExercises();
    const first = all[0];

    const result = await getExerciseBySlug(first.slug);
    expect(result).not.toBeNull();
    expect(result?.slug).toBe(first.slug);
  });

  it("should return null for unknown slug", async () => {
    const { getExerciseBySlug } = await import("@/lib/actions/exercises");
    const result = await getExerciseBySlug("non-existent-exercise-slug");
    expect(result).toBeNull();
  });

  it("should get exercises by slug from seed", async () => {
    const { getExerciseBySlug, getPublishedExercises } = await import("@/lib/actions/exercises");
    const all = await getPublishedExercises();
    const slug = all[0].slug;
    const result = await getExerciseBySlug(slug);
    expect(result).not.toBeNull();
  });

  it("should reject admin actions for non-admin users", async () => {
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1", user_metadata: { user_role: "member" } } },
          error: null,
        }),
      },
    };

    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;
    mockCreateSupabaseServerClient.mockResolvedValue(mockClient);

    const { createExercise } = await import("@/lib/actions/exercises");
    await expect(
      createExercise({
        name: "Test Exercise",
        category: "Strength",
      } as never)
    ).rejects.toThrow("Forbidden");
  });
});