import { describe, it, expect } from "vitest";
import { IdParamSchema, ProfileUpdateSchema } from "@/types/api";

describe("API validation schemas", () => {
  describe("IdParamSchema", () => {
    it("should accept valid UUIDs", () => {
      const valid = "550e8400-e29b-41d4-a716-446655440000";
      expect(IdParamSchema.safeParse(valid).success).toBe(true);
    });

    it("should accept zero UUID", () => {
      expect(IdParamSchema.safeParse("00000000-0000-0000-0000-000000000000").success).toBe(true);
    });

    it("should reject non-UUID strings", () => {
      expect(IdParamSchema.safeParse("not-a-uuid").success).toBe(false);
    });

    it("should reject empty strings", () => {
      expect(IdParamSchema.safeParse("").success).toBe(false);
    });
  });

  describe("ExerciseCreateSchema", () => {
    it("should validate a minimal valid exercise", async () => {
      const { ExerciseCreateSchema } = await import("@/types/api");
      const result = ExerciseCreateSchema.safeParse({
        name: "Test Exercise",
        category: "Chest",
        difficulty: "Intermediate",
        target_muscles: "Chest",
      });
      expect(result.success).toBe(true);
    });

    it("should reject exercise with empty name", async () => {
      const { ExerciseCreateSchema } = await import("@/types/api");
      const result = ExerciseCreateSchema.safeParse({
        name: "",
        category: "Chest",
        difficulty: "Beginner",
        target_muscles: "Chest",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("ProfileUpdateSchema", () => {
    it("should accept valid profile data", () => {
      const result = ProfileUpdateSchema.safeParse({
        full_name: "John Doe",
        phone: "+1234567890",
      });
      expect(result.success).toBe(true);
    });

    it("should strip unknown fields", () => {
      const result = ProfileUpdateSchema.safeParse({
        full_name: "Jane",
        role: "admin",
        _hack: "injected",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty("role");
        expect(result.data).not.toHaveProperty("_hack");
      }
    });

    it("should accept empty full_name (optional field)", () => {
      const result = ProfileUpdateSchema.safeParse({ full_name: "" });
      expect(result.success).toBe(true);
    });
  });
});