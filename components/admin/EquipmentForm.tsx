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
    difficulty: string;
    muscles_trained: string;
    secondary_muscles: string;
    instructions: string;
    common_mistakes: string;
    maintenance_tips: string;
    seat_adjustment: string;
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
  const [difficulty, setDifficulty] = React.useState(equipment?.difficulty ?? "All Levels");
  const [musclesTrained, setMusclesTrained] = React.useState(
    equipment?.muscles_trained?.join(", ") ?? ""
  );
  const [equipSecondaryMuscles, setEquipSecondaryMuscles] = React.useState(
    equipment?.secondary_muscles?.join(", ") ?? ""
  );
  const [instructions, setInstructions] = React.useState(
    equipment?.instructions?.join(", ") ?? ""
  );
  const [equipCommonMistakes, setEquipCommonMistakes] = React.useState(
    equipment?.common_mistakes?.join(", ") ?? ""
  );
  const [maintenanceTips, setMaintenanceTips] = React.useState(
    equipment?.maintenance_tips?.join(", ") ?? ""
  );
  const [seatAdjustment, setSeatAdjustment] = React.useState(
    equipment?.seat_adjustment?.join(", ") ?? ""
  );

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
        difficulty,
        muscles_trained: musclesTrained.trim(),
        secondary_muscles: equipSecondaryMuscles.trim(),
        instructions: instructions.trim(),
        common_mistakes: equipCommonMistakes.trim(),
        maintenance_tips: maintenanceTips.trim(),
        seat_adjustment: seatAdjustment.trim(),
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

      <Select
        label="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        options={[
          { value: "Beginner", label: "Beginner" },
          { value: "Intermediate", label: "Intermediate" },
          { value: "Advanced", label: "Advanced" },
          { value: "All Levels", label: "All Levels" },
        ]}
      />

      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Muscles Trained</p>
        <textarea
          value={musclesTrained}
          onChange={(e) => setMusclesTrained(e.target.value)}
          placeholder="Comma-separated values"
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm px-4 py-2.5 min-h-[80px] focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Secondary Muscles</p>
        <textarea
          value={equipSecondaryMuscles}
          onChange={(e) => setEquipSecondaryMuscles(e.target.value)}
          placeholder="Comma-separated values"
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm px-4 py-2.5 min-h-[80px] focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Instructions (how-to-use steps)</p>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Comma-separated values"
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm px-4 py-2.5 min-h-[80px] focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Common Mistakes</p>
        <textarea
          value={equipCommonMistakes}
          onChange={(e) => setEquipCommonMistakes(e.target.value)}
          placeholder="Comma-separated values"
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm px-4 py-2.5 min-h-[80px] focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Maintenance Tips</p>
        <textarea
          value={maintenanceTips}
          onChange={(e) => setMaintenanceTips(e.target.value)}
          placeholder="Comma-separated values"
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm px-4 py-2.5 min-h-[80px] focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Seat Adjustment</p>
        <textarea
          value={seatAdjustment}
          onChange={(e) => setSeatAdjustment(e.target.value)}
          placeholder="Comma-separated values"
          className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm px-4 py-2.5 min-h-[80px] focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

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
