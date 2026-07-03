import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase-browser", () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Dashboard", () => {
  it("should fetch member profile", async () => {
    const { getMyProfile } = await import("@/lib/actions/member-profile");
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: { id: "user-1", email: "member@example.com" },
          },
          error: null,
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({
                data: {
                  id: "user-1",
                  full_name: "Test Member",
                  phone: "+919876543210",
                  role: "member",
                },
                error: null,
              }),
          }),
        }),
      }),
    };

    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;
    mockCreateSupabaseServerClient.mockResolvedValue(mockClient);

    const profile = await getMyProfile();
    expect(profile.full_name).toBe("Test Member");
    expect(profile.email).toBe("member@example.com");
  });

  it("should fetch member subscriptions", async () => {
    const { getMySubscriptions } = await import("@/lib/actions/member-profile");
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: { id: "user-1", email: "member@example.com" },
          },
          error: null,
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () =>
              Promise.resolve({
                data: [
                  {
                    id: "sub-1",
                    plan_id: "plan-1",
                    plan: { id: "plan-1", name: "6 Months" },
                    payment_status: "paid",
                    starts_at: new Date().toISOString(),
                    expires_at: new Date().toISOString(),
                  },
                ],
                error: null,
              }),
          }),
        }),
      }),
    };

    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;
    mockCreateSupabaseServerClient.mockResolvedValue(mockClient);

    const subscriptions = await getMySubscriptions();
    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0].plan.name).toBe("6 Months");
  });
});
