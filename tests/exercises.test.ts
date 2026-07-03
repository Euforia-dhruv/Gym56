import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase-admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

describe("Exercise CRUD", () => {
  it("should fetch published exercises", async () => {
    const { getPublishedExercises } = await import("@/lib/actions/exercises");
    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;

    mockCreateSupabaseServerClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            is: () => ({
              order: () =>
                Promise.resolve({
                  data: [
                    { id: "1", name: "Bench Press", slug: "bench-press", category: "Chest" },
                  ],
                  error: null,
                }),
            }),
          }),
        }),
      }),
    });

    const exercises = await getPublishedExercises();
    expect(exercises).toHaveLength(1);
    expect(exercises[0].name).toBe("Bench Press");
  });

  it("should fetch related exercises", async () => {
    const { getRelatedExercises } = await import("@/lib/actions/exercises");
    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;

    mockCreateSupabaseServerClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () =>
              Promise.resolve({
                data: [
                  {
                    related_exercise: { id: "2", name: "Incline Press", slug: "incline-press" },
                  },
                ],
                error: null,
              }),
          }),
        }),
      }),
    });

    const related = await getRelatedExercises("exercise-1");
    expect(related).toHaveLength(1);
    expect(related[0].name).toBe("Incline Press");
  });
});
