import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase-admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Authentication", () => {
  it("should allow public access to getEquipment", async () => {
    const { getEquipment } = await import("@/lib/actions/equipment");
    const mockClient = {
      from: () => ({
        select: () => ({
          is: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      }),
    };

    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;
    mockCreateSupabaseServerClient.mockResolvedValue(mockClient);

    const result = await getEquipment();
    expect(result).toEqual([]);
  });

  it("should require admin role for admin actions", async () => {
    const { createEquipment } = await import("@/lib/actions/equipment");
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-1",
              user_metadata: { user_role: "member" },
            },
          },
          error: null,
        }),
      },
    };

    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;
    mockCreateSupabaseServerClient.mockResolvedValue(mockClient);

    await expect(
      createEquipment({
        name: "Test",
        category: "Cardio",
        description: "",
        quantity: 1,
        condition: "excellent",
        location: "",
        difficulty: "All Levels",
        muscles_trained: "",
        common_mistakes: "",
        maintenance_tips: "",
        instructions: "",
        is_available: true,
        is_published: false,
      } as unknown as Parameters<typeof createEquipment>[0])
    ).rejects.toThrow("Forbidden");
  });
});
