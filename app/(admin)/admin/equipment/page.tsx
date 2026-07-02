'use client';

import * as React from 'react';
import { Plus, Dumbbell, Filter } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Column } from '@/components/ui/Table';
import { getConditionColor, cn } from '@/lib/utils';

// ─── Mock data ────────────────────────────────────────────────────────────────

type EquipmentItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  condition: string;
  location: string;
  isAvailable: boolean;
  isPublished: boolean;
};

const MOCK_EQUIPMENT: EquipmentItem[] = [
  { id: '1', name: 'Treadmill Pro 3000', category: 'Cardio', quantity: 4, condition: 'excellent', location: 'Ground Floor', isAvailable: true, isPublished: true },
  { id: '2', name: 'Olympic Barbell Set', category: 'Free Weights', quantity: 6, condition: 'good', location: 'Ground Floor', isAvailable: true, isPublished: true },
  { id: '3', name: 'Cable Crossover Machine', category: 'Machines', quantity: 2, condition: 'good', location: 'Ground Floor', isAvailable: true, isPublished: true },
  { id: '4', name: 'Rowing Machine', category: 'Cardio', quantity: 2, condition: 'fair', location: 'Terrace', isAvailable: true, isPublished: true },
  { id: '5', name: 'Incline Bench', category: 'Strength', quantity: 3, condition: 'good', location: 'Ground Floor', isAvailable: true, isPublished: true },
  { id: '6', name: 'Dumbbell Rack (5–50kg)', category: 'Free Weights', quantity: 1, condition: 'excellent', location: 'Ground Floor', isAvailable: true, isPublished: true },
  { id: '7', name: 'Pull-Up Station', category: 'Functional', quantity: 2, condition: 'good', location: 'Terrace', isAvailable: true, isPublished: true },
  { id: '8', name: 'Leg Press Machine', category: 'Machines', quantity: 1, condition: 'maintenance', location: 'Ground Floor', isAvailable: false, isPublished: false },
  { id: '9', name: 'Elliptical Trainer', category: 'Cardio', quantity: 3, condition: 'good', location: 'Ground Floor', isAvailable: true, isPublished: true },
  { id: '10', name: 'Kettlebell Set', category: 'Free Weights', quantity: 1, condition: 'excellent', location: 'Terrace', isAvailable: true, isPublished: true },
  { id: '11', name: 'Foam Roller Station', category: 'Recovery', quantity: 5, condition: 'good', location: 'Terrace', isAvailable: true, isPublished: true },
  { id: '12', name: 'Smith Machine', category: 'Machines', quantity: 1, condition: 'good', location: 'Ground Floor', isAvailable: true, isPublished: true },
];

const CATEGORIES = ['All', 'Cardio', 'Strength', 'Free Weights', 'Machines', 'Functional', 'Recovery'];

// ─── Columns ─────────────────────────────────────────────────────────────────

const columns: Column<EquipmentItem>[] = [
  {
    key: 'name',
    header: 'Equipment',
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
    key: 'category',
    header: 'Category',
    sortable: true,
    render: (val) => (
      <Badge variant="outline" size="sm">{String(val)}</Badge>
    ),
  },
  {
    key: 'quantity',
    header: 'Qty',
    sortable: true,
    render: (val) => <span className="font-mono text-white">{String(val)}</span>,
  },
  {
    key: 'condition',
    header: 'Condition',
    sortable: true,
    render: (val) => {
      const label = String(val);
      const cls = getConditionColor(label);
      return (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', cls)}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      );
    },
  },
  {
    key: 'isAvailable',
    header: 'Available',
    render: (val) =>
      val ? (
        <Badge variant="success" dot size="sm">Available</Badge>
      ) : (
        <Badge variant="danger" dot size="sm">Unavailable</Badge>
      ),
  },
  {
    key: 'isPublished',
    header: 'Status',
    render: (val) =>
      val ? (
        <Badge variant="success" size="sm">Published</Badge>
      ) : (
        <Badge variant="warning" size="sm">Draft</Badge>
      ),
  },
  {
    key: 'id',
    header: 'Actions',
    render: (_, row) => <RowActions row={row} />,
  },
];

// ─── Row actions ─────────────────────────────────────────────────────────────

function RowActions({ row }: { row: EquipmentItem }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" aria-label={`Edit ${row.name}`}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          aria-label={`Delete ${row.name}`}
          onClick={() => setConfirmOpen(true)}
        >
          Delete
        </Button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="Delete Equipment"
        description={`Are you sure you want to delete "${row.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EquipmentPage() {
  const [category, setCategory] = React.useState('All');

  const filtered = category === 'All'
    ? MOCK_EQUIPMENT
    : MOCK_EQUIPMENT.filter((e) => e.category === category);

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
        <Button size="sm">
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
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
              category === cat
                ? 'bg-accent text-white'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Data table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="w-8 h-8" />}
          title="No equipment found"
          description="Try selecting a different category or add new equipment."
          action={
            <Button size="sm">
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
            row.location.toLowerCase().includes(q)
          }
          toolbar={
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{MOCK_EQUIPMENT.length} total items</span>
            </div>
          }
        />
      )}
    </div>
  );
}
