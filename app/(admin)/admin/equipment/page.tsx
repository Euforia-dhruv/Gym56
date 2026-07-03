"use client";

import * as React from "react";
import { Plus, Dumbbell, Filter, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EquipmentForm } from "@/components/admin/EquipmentForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Column } from "@/components/ui/Table";
import { getConditionColor, cn } from "@/lib/utils";
import {
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  uploadEquipmentImage,
} from "@/lib/actions/equipment";
import type { Equipment } from "@/types";

const CATEGORIES = [
  "All",
  "Cardio",
  "Strength",
  "Free Weights",
  "Machines",
  "Functional",
  "Recovery",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EquipmentPage() {
  const [equipment, setEquipment] = React.useState<Equipment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [category, setCategory] = React.useState("All");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Equipment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Equipment | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Fetch equipment on mount
  React.useEffect(() => {
    getEquipment()
      .then(setEquipment)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    category === "All"
      ? equipment
      : equipment.filter((e) => e.category === category);

  const handleCreate = async (data: Parameters<typeof createEquipment>[0]) => {
    const created = await createEquipment(data);
    setEquipment((prev) => [created, ...prev]);
    setModalOpen(false);
  };

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editing) return;
    const updated = await updateEquipment({ id: editing.id, ...data } as Parameters<typeof updateEquipment>[0]);
    setEquipment((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditing(null);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteEquipment(deleteConfirm.id);
      setEquipment((prev) => prev.filter((e) => e.id !== deleteConfirm.id));
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleImageUpload = async (formData: FormData) => {
    const id = editing?.id || equipment[0]?.id;
    if (!id) throw new Error("No equipment selected");
    return uploadEquipmentImage(id, formData);
  };

  // ─── Columns ───────────────────────────────────────────────────────────────

  const columns: Column<Equipment>[] = [
    {
      key: "name",
      header: "Equipment",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-4 h-4 text-accent" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{row.name}</p>
            <p className="text-xs text-gray-500">{row.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (val) => (
        <Badge variant="outline" size="sm">
          {String(val)}
        </Badge>
      ),
    },
    {
      key: "quantity",
      header: "Qty",
      sortable: true,
      render: (val) => <span className="font-mono text-white">{String(val)}</span>,
    },
    {
      key: "condition",
      header: "Condition",
      sortable: true,
      render: (val) => {
        const label = String(val);
        const cls = getConditionColor(label);
        return (
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold border",
              cls
            )}
          >
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </span>
        );
      },
    },
    {
      key: "is_available",
      header: "Available",
      render: (val) =>
        val ? (
          <Badge variant="success" dot size="sm">
            Available
          </Badge>
        ) : (
          <Badge variant="danger" dot size="sm">
            Unavailable
          </Badge>
        ),
    },
    {
      key: "is_published",
      header: "Status",
      render: (val) =>
        val ? (
          <Badge variant="success" size="sm">
            Published
          </Badge>
        ) : (
          <Badge variant="warning" size="sm">
            Draft
          </Badge>
        ),
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
        title="Equipment"
        description="Manage gym equipment inventory, conditions, and availability."
      >
        <Button size="sm" variant="outline">
          <Filter className="w-4 h-4" aria-hidden="true" />
          Export
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Equipment
        </Button>
      </PageHeader>

      {/* Category filter pills */}
      <div
        role="group"
        aria-label="Filter by category"
        className="flex flex-wrap gap-2"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
              category === cat
                ? "bg-accent text-white"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Data table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" aria-label="Loading…" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="w-8 h-8" />}
          title="No equipment found"
          description="Try selecting a different category or add new equipment."
          action={
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Equipment
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          searchPlaceholder="Search equipment…"
          pageSize={8}
          filterFn={(row, q) =>
            row.name.toLowerCase().includes(q) ||
            row.category.toLowerCase().includes(q) ||
            (row.location ?? "").toLowerCase().includes(q)
          }
          toolbar={
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{equipment.length} total items</span>
            </div>
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
        title={editing ? "Edit Equipment" : "Add Equipment"}
        description={
          editing
            ? `Editing "${editing.name}"`
            : "Add new equipment to the gym inventory."
        }
        size="lg"
      >
        <EquipmentForm
          equipment={editing}
          onSubmit={async (data) => {
            if (editing) {
              await handleUpdate(data as unknown as Record<string, unknown>);
            } else {
              await handleCreate(data as Parameters<typeof createEquipment>[0]);
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
        title="Delete Equipment"
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
