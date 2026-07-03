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

describe("Contact Form", () => {
  it("should submit contact form", async () => {
    const { submitContactForm } = await import("@/lib/actions/contact");
    const mockClient = {
      from: () => ({
        insert: () => Promise.resolve({ error: null }),
      }),
    };

    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;
    mockCreateSupabaseServerClient.mockResolvedValue(mockClient);

    const result = await submitContactForm({
      name: "Test User",
      email: "test@example.com",
      subject: "Test",
      message: "Test message",
    });

    expect(result.success).toBe(true);
  });

  it("should fetch contact messages (admin only)", async () => {
    const { getContactMessages } = await import("@/lib/actions/contact");
    const mockClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "admin-1",
              user_metadata: { user_role: "admin" },
            },
          },
          error: null,
        }),
      },
      from: () => ({
        select: () => ({
          order: () =>
            Promise.resolve({
              data: [
                {
                  id: "1",
                  name: "Test User",
                  email: "test@example.com",
                  subject: "Test",
                  message: "Test message",
                  created_at: new Date().toISOString(),
                  is_read: false,
                },
              ],
              error: null,
            }),
        }),
      }),
    };

    const mockCreateSupabaseServerClient = (await import("@/lib/supabase-server"))
      .createSupabaseServerClient as ReturnType<typeof vi.fn>;
    mockCreateSupabaseServerClient.mockResolvedValue(mockClient);

    const messages = await getContactMessages();
    expect(messages).toHaveLength(1);
    expect(messages[0].name).toBe("Test User");
  });
});
