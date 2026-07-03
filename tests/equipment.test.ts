import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase-admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}));

describe("Equipment CRUD", () => {
  it("should fetch published equipment", async () => {
    const { getPublishedEquipment } = await import("@/lib/actions/equipment");
    const mockClient = vi.fn();

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
                    { id: "1", name: "Treadmill", slug: "treadmill", category: "Cardio" },
                  ],
                  error: null,
                }),
            }),
          }),
        }),
      }),
    });

    const equipment = await getPublishedEquipment();
    expect(equipment).toHaveLength(1);
    expect(equipment[0].name).toBe("Treadmill");
  });

  it("should fetch equipment by slug", async () => {
    const { getEquipmentBySlug } = await import("@/lib/actions/equipment");
    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;

    mockCreateSupabaseServerClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              is: () => ({
                single: () =>
                  Promise.resolve({
                    data: { id: "1", name: "Treadmill", slug: "treadmill" },
                    error: null,
                  }),
              }),
            }),
          }),
        }),
      }),
    });

    const equipment = await getEquipmentBySlug("treadmill");
    expect(equipment).toBeDefined();
    expect(equipment.slug).toBe("treadmill");
  });
});
