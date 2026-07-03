"use client";

import * as React from "react";
import { Plus, BookOpen, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ExerciseForm } from "@/components/admin/ExerciseForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Column } from "@/components/ui/Table";
import { getDifficultyColor, cn } from "@/lib/utils";
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  uploadExerciseImage,
} from "@/lib/actions/exercises";
import type { Exercise } from "@/types";

const CATEGORIES = ["All", "Chest", "Back", "Shoulders", "Legs", "Arms", "Core", "Cardio", "Glutes", "Obliques", "Abs"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ExercisesPage() {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [category, setCategory] = React.useState("All");
  const [difficulty, setDifficulty] = React.useState("All");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Exercise | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Exercise | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Fetch exercises on mount
  React.useEffect(() => {
    getExercises()
      .then((data) => setExercises(data as unknown as Exercise[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = exercises.filter((e) => {
    const catMatch = category === "All" || e.category === category;
    const diffMatch = difficulty === "All" || e.difficulty === difficulty;
    return catMatch && diffMatch;
  });

  const handleCreate = async (data: Record<string, unknown>) => {
    const created = await createExercise(data as Parameters<typeof createExercise>[0]);
    setExercises((prev) => [created as unknown as Exercise, ...prev]);
    setModalOpen(false);
  };

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editing) return;
    const updated = await updateExercise({ id: editing.id, ...data } as Parameters<typeof updateExercise>[0]);
    setExercises((prev) => prev.map((e) => (e.id === updated.id ? (updated as unknown as Exercise) : e)));
    setEditing(null);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteExercise(deleteConfirm.id);
      setExercises((prev) => prev.filter((e) => e.id !== deleteConfirm.id));
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleImageUpload = async (formData: FormData) => {
    const id = editing?.id || exercises[0]?.id;
    if (!id) throw new Error("No exercise selected");
    return uploadExerciseImage(id, formData);
  };

  // ─── Columns ───────────────────────────────────────────────────────────────

  const columns: Column<Exercise>[] = [
    {
      key: "name",
      header: "Exercise",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-accent" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{row.name}</p>
            <p className="text-xs text-gray-500">{row.muscle_group || row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (val) => <Badge variant="outline" size="sm">{String(val)}</Badge>,
    },
    {
      key: "difficulty",
      header: "Difficulty",
      sortable: true,
      render: (val) => {
        const label = String(val);
        return (
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", getDifficultyColor(label))}>
            {label}
          </span>
        );
      },
    },
    {
      key: "equipment_label",
      header: "Equipment",
      render: (val) => <span className="text-gray-400 text-sm">{val ? String(val) : "—"}</span>,
    },
    {
      key: "is_published",
      header: "Status",
      render: (val) =>
        val ? <Badge variant="success" size="sm">Published</Badge> : <Badge variant="warning" size="sm">Draft</Badge>,
    },
    {
      key: "id",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            aria-label={`Edit ${row.name}`}
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            aria-label={`Delete ${row.name}`}
            onClick={() => setDeleteConfirm(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exercises"
        description="Manage exercise library, instructions, and difficulty levels."
      >
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Exercise
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Category</p>
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  category === cat
                    ? "bg-accent text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Difficulty</p>
          <div role="group" aria-label="Filter by difficulty" className="flex flex-wrap gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                aria-pressed={difficulty === d}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  difficulty === d
                    ? "bg-accent text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" aria-label="Loading…" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No exercises found"
          description="Try adjusting the filters or add a new exercise."
          action={
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Exercise
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search exercises…"
          pageSize={8}
          filterFn={(row, q) =>
            row.name.toLowerCase().includes(q) ||
            row.category.toLowerCase().includes(q) ||
            (row.muscle_group ?? "").toLowerCase().includes(q) ||
            (row.equipment_label ?? "").toLowerCase().includes(q)
          }
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Exercise" : "Add Exercise"}
        description={editing ? `Editing "${editing.name}"` : "Create a new exercise with instructions and tips."}
        size="xl"
      >
        <ExerciseForm
          exercise={editing}
          onSubmit={async (data) => {
            if (editing) {
              await handleUpdate(data as unknown as Record<string, unknown>);
            } else {
              await handleCreate(data as unknown as Record<string, unknown>);
            }
          }}
          onImageUpload={handleImageUpload}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Exercise"
        description={`Delete "${deleteConfirm?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
