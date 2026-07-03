"use client";

import * as React from "react";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { EXERCISE_CATEGORIES, DIFFICULTIES } from "@/types";
import type { Exercise } from "@/types";

export interface ExerciseFormProps {
  exercise?: Exercise | null;
  equipmentOptions?: { value: string; label: string }[];
  onSubmit: (data: {
    name: string;
    category: string;
    muscle_group: string;
    equipment_id: string | null;
    equipment_label: string;
    difficulty: string;
    target_muscles: string;
    common_mistakes: string;
    safety_tips: string;
    is_published: boolean;
  }) => Promise<void>;
  onImageUpload?: (formData: FormData) => Promise<{ publicUrl: string }>;
  onImageDelete?: () => Promise<void>;
  onCancel?: () => void;
}

export function ExerciseForm({
  exercise,
  equipmentOptions = [],
  onSubmit,
  onImageUpload,
  onImageDelete,
  onCancel,
}: ExerciseFormProps) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const [name, setName] = React.useState(exercise?.name ?? "");
  const [category, setCategory] = React.useState(exercise?.category ?? "Chest");
  const [muscleGroup, setMuscleGroup] = React.useState(exercise?.muscle_group ?? "");
  const [equipmentId, setEquipmentId] = React.useState(exercise?.equipment_id ?? "");
  const [equipmentLabel, setEquipmentLabel] = React.useState(exercise?.equipment_label ?? "");
  const [difficulty, setDifficulty] = React.useState(exercise?.difficulty ?? "Beginner");
  const [targetMuscles, setTargetMuscles] = React.useState(
    exercise?.target_muscles?.join(", ") ?? ""
  );
  const [commonMistakes, setCommonMistakes] = React.useState(
    exercise?.common_mistakes?.join(", ") ?? ""
  );
  const [safetyTips, setSafetyTips] = React.useState(
    exercise?.safety_tips?.join(", ") ?? ""
  );
  const [isPublished, setIsPublished] = React.useState(exercise?.is_published ?? false);

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
        muscle_group: muscleGroup.trim(),
        equipment_id: equipmentId || null,
        equipment_label: equipmentLabel.trim(),
        difficulty,
        target_muscles: targetMuscles.trim(),
        common_mistakes: commonMistakes.trim(),
        safety_tips: safetyTips.trim(),
        is_published: isPublished,
      });
      toast({
        title: exercise ? "Exercise updated" : "Exercise created",
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
          placeholder="Chest Press"
          required
          className="sm:col-span-2"
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={EXERCISE_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <Select
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
          options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
        />
        <Input
          label="Muscle Group"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          placeholder="Pectorals"
        />
        <Select
          label="Equipment"
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
          options={[
            { value: "", label: "None / Custom" },
            ...equipmentOptions,
          ]}
        />
        {!equipmentId && (
          <Input
            label="Equipment Label (custom text)"
            value={equipmentLabel}
            onChange={(e) => setEquipmentLabel(e.target.value)}
            placeholder="Barbell, Dumbbells, etc."
            className="sm:col-span-2"
          />
        )}
      </div>

      <Textarea
        label="Target Muscles (comma-separated)"
        value={targetMuscles}
        onChange={(e) => setTargetMuscles(e.target.value)}
        placeholder="Pectoralis Major, Anterior Deltoid, Triceps Brachii"
        rows={2}
      />
      <Textarea
        label="Common Mistakes (comma-separated)"
        value={commonMistakes}
        onChange={(e) => setCommonMistakes(e.target.value)}
        placeholder="Bouncing the bar off your chest, Flaring elbows too much"
        rows={2}
      />
      <Textarea
        label="Safety Tips (comma-separated)"
        value={safetyTips}
        onChange={(e) => setSafetyTips(e.target.value)}
        placeholder="Always use a spotter, Start with light weight"
        rows={2}
      />

      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4 accent-accent rounded"
        />
        Published (visible to public)
      </label>

      {/* Image upload */}
      {onImageUpload && (
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">Image</p>
          <ImageUploader
            currentImage={exercise?.primary_image_url}
            onUpload={onImageUpload}
            onDelete={onImageDelete}
            altText={name || "Exercise image"}
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
          {exercise ? "Save Changes" : "Create Exercise"}
        </Button>
      </div>
    </form>
  );
}
