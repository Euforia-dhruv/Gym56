"use client";

import * as React from "react";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { EQUIPMENT_CATEGORIES, CONDITIONS } from "@/types";
import type { Equipment } from "@/types";

export interface EquipmentFormProps {
  /** Existing equipment for editing; undefined = create mode */
  equipment?: Equipment | null;
  /** Called with form data for create/update */
  onSubmit: (data: {
    name: string;
    category: string;
    description: string;
    quantity: number;
    condition: string;
    location: string;
    is_available: boolean;
    is_published: boolean;
  }) => Promise<void>;
  /** Called to upload an image */
  onImageUpload?: (formData: FormData) => Promise<{ publicUrl: string }>;
  /** Called to delete the current image */
  onImageDelete?: () => Promise<void>;
  /** Called to close/cancel */
  onCancel?: () => void;
}

export function EquipmentForm({
  equipment,
  onSubmit,
  onImageUpload,
  onImageDelete,
  onCancel,
}: EquipmentFormProps) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const [name, setName] = React.useState(equipment?.name ?? "");
  const [category, setCategory] = React.useState(equipment?.category ?? "Cardio");
  const [description, setDescription] = React.useState(equipment?.description ?? "");
  const [quantity, setQuantity] = React.useState(equipment?.quantity ?? 1);
  const [condition, setCondition] = React.useState(equipment?.condition ?? "good");
  const [location, setLocation] = React.useState(equipment?.location ?? "");
  const [isAvailable, setIsAvailable] = React.useState(equipment?.is_available ?? true);
  const [isPublished, setIsPublished] = React.useState(equipment?.is_published ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Name is required", variant: "error" });
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        description: description.trim(),
        quantity,
        condition,
        location: location.trim(),
        is_available: isAvailable,
        is_published: isPublished,
      });
      toast({
        title: equipment ? "Equipment updated" : "Equipment created",
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
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Treadmill Pro 3000"
          required
          className="sm:col-span-2"
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={EQUIPMENT_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <Select
          label="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          options={CONDITIONS.map((c) => ({
            value: c,
            label: c.charAt(0).toUpperCase() + c.slice(1),
          }))}
        />
        <Input
          label="Quantity"
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Input
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ground Floor"
        />
      </div>

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the equipment, its uses, and any relevant details…"
        rows={4}
      />

      {/* Availability & publish toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="w-4 h-4 accent-accent rounded"
          />
          Available for use
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 accent-accent rounded"
          />
          Published (visible to public)
        </label>
      </div>

      {/* Image upload */}
      {onImageUpload && (
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">Image</p>
          <ImageUploader
            currentImage={equipment?.primary_image_url}
            onUpload={onImageUpload}
            onDelete={onImageDelete}
            altText={name || "Equipment image"}
          />
        </div>
      )}

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
          {equipment ? "Save Changes" : "Create Equipment"}
        </Button>
      </div>
    </form>
  );
}
