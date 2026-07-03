"use client";

import * as React from "react";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { MembershipPlan } from "@/types";

export interface MembershipPlanFormProps {
  plan?: MembershipPlan | null;
  onSubmit: (data: {
    name: string;
    duration_months: number;
    price_minor: number;
    savings_label: string;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
  }) => Promise<void>;
  onCancel?: () => void;
}

export function MembershipPlanForm({
  plan,
  onSubmit,
  onCancel,
}: MembershipPlanFormProps) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const [name, setName] = React.useState(plan?.name ?? "");
  const [durationMonths, setDurationMonths] = React.useState(plan?.duration_months ?? 1);
  const [priceInr, setPriceInr] = React.useState(
    plan ? Math.round(plan.price_minor / 100) : 0
  );
  const [savingsLabel, setSavingsLabel] = React.useState(plan?.savings_label ?? "");
  const [isFeatured, setIsFeatured] = React.useState(plan?.is_featured ?? false);
  const [isActive, setIsActive] = React.useState(plan?.is_active ?? true);
  const [sortOrder, setSortOrder] = React.useState(plan?.sort_order ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Name is required", variant: "error" });
      return;
    }

    if (priceInr < 0) {
      toast({ title: "Price must be ≥ 0", variant: "error" });
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        duration_months: durationMonths,
        price_minor: priceInr * 100, // Convert to paise/minor units
        savings_label: savingsLabel.trim(),
        is_featured: isFeatured,
        is_active: isActive,
        sort_order: sortOrder,
      });
      toast({
        title: plan ? "Plan updated" : "Plan created",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Plan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="6 Months"
          required
        />
        <Input
          label="Duration (months)"
          type="number"
          min={1}
          value={durationMonths}
          onChange={(e) => setDurationMonths(Number(e.target.value))}
          required
        />
        <Input
          label="Price (₹)"
          type="number"
          min={0}
          value={priceInr}
          onChange={(e) => setPriceInr(Number(e.target.value))}
          required
          hint="Price in Indian Rupees"
        />
        <Input
          label="Savings Label (optional)"
          value={savingsLabel}
          onChange={(e) => setSavingsLabel(e.target.value)}
          placeholder="Save ₹2000"
        />
        <Input
          label="Sort Order"
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 accent-accent rounded"
          />
          Featured (Most Popular)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-accent rounded"
          />
          Active (visible to members)
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            <X className="w-4 h-4" aria-hidden="true" />
            Cancel
          </Button>
        )}
        <Button type="submit" loading={saving}>
          <Save className="w-4 h-4" aria-hidden="true" />
          {plan ? "Save Changes" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}
