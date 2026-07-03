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

describe("Membership CRUD", () => {
  it("should fetch active plans", async () => {
    const { getActivePlans } = await import("@/lib/actions/memberships");
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
                    id: "1",
                    name: "1 Month",
                    duration_months: 1,
                    price_minor: 150000,
                    is_active: true,
                  },
                ],
                error: null,
              }),
          }),
        }),
      }),
    });

    const plans = await getActivePlans();
    expect(plans).toHaveLength(1);
    expect(plans[0].name).toBe("1 Month");
  });

  it("should require admin for create", async () => {
    const { createMembershipPlan } = await import("@/lib/actions/memberships");
    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;

    mockCreateSupabaseServerClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    });

    await expect(
      createMembershipPlan({
        name: "Test Plan",
        duration_months: 1,
        price_minor: 10000,
        savings_label: "",
        is_featured: false,
        is_active: true,
        sort_order: 0,
      })
    ).rejects.toThrow("Unauthenticated");
  });
});
