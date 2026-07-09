import { describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

describe("rate-limit", () => {
  it("should allow first request", () => {
    const { allowed, retryAfter } = checkRateLimit("127.0.0.1", 5, 60_000);
    expect(allowed).toBe(true);
    expect(retryAfter).toBe(0);
  });

  it("should block requests exceeding limit", () => {
    const ip = "10.0.0.1";
    for (let i = 0; i < 5; i++) {
      const { allowed } = checkRateLimit(ip, 5, 60_000);
      expect(allowed).toBe(true);
    }
    const { allowed, retryAfter } = checkRateLimit(ip, 5, 60_000);
    expect(allowed).toBe(false);
    expect(retryAfter).toBeGreaterThan(0);
  });

  it("should reset after window expires", () => {
    const ip = "10.0.0.2";
    checkRateLimit(ip, 1, -1);
    const { allowed } = checkRateLimit(ip, 1, 60_000);
    expect(allowed).toBe(true);
  });

  it("should treat different IPs independently", () => {
    checkRateLimit("10.0.0.3", 1, 60_000);
    const { allowed } = checkRateLimit("10.0.0.4", 1, 60_000);
    expect(allowed).toBe(true);
  });

  it("getClientIp reads x-forwarded-for", () => {
    const req = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("203.0.113.5");
  });

  it("getClientIp falls back to x-real-ip", () => {
    const req = new Request("https://example.com", {
      headers: { "x-real-ip": "198.51.100.2" },
    });
    expect(getClientIp(req)).toBe("198.51.100.2");
  });

  it("getClientIp returns unknown when no headers", () => {
    const req = new Request("https://example.com");
    expect(getClientIp(req)).toBe("unknown");
  });
});

describe("utils", () => {
  it("slugify converts text to URL-safe slug", async () => {
    const { slugify } = await import("@/lib/utils");
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("Bench Press (Medium Grip)")).toBe("bench-press-medium-grip");
    expect(slugify("  Trimmed  ")).toBe("trimmed");
  });

  it("cn merges class names correctly", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
    expect(cn("text-red-500", false && "hidden")).toBe("text-red-500");
    expect(cn("", null, undefined, "block")).toBe("block");
  });
});

describe("Contact form", () => {
  it("should reject empty name", async () => {
    const { submitContactForm } = await import("@/lib/actions/contact");
    await expect(
      submitContactForm({ name: "", email: "a@b.com", subject: "Hi", message: "Hello" })
    ).rejects.toThrow();
  });

  it("should reject invalid email", async () => {
    const { submitContactForm } = await import("@/lib/actions/contact");
    await expect(
      submitContactForm({ name: "Test", email: "not-an-email", subject: "Hi", message: "Hello" })
    ).rejects.toThrow();
  });
});