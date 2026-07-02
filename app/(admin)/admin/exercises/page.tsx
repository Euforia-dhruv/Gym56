'use client';

import * as React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Column } from '@/components/ui/Table';
import { getDifficultyColor, cn } from '@/lib/utils';

// ─── Mock data ────────────────────────────────────────────────────────────────

type Exercise = {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscleGroup: string;
  equipment: string;
  steps: number;
  isPublished: boolean;
};

const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'Chest Press', category: 'Chest', difficulty: 'Beginner', muscleGroup: 'Pectorals', equipment: 'Barbell', steps: 5, isPublished: true },
  { id: '2', name: 'Pull-Up', category: 'Back', difficulty: 'Intermediate', muscleGroup: 'Lats', equipment: 'Pull-Up Bar', steps: 5, isPublished: true },
  { id: '3', name: 'Overhead Press', category: 'Shoulders', difficulty: 'Intermediate', muscleGroup: 'Deltoids', equipment: 'Barbell', steps: 4, isPublished: true },
  { id: '4', name: 'Squat', category: 'Legs', difficulty: 'Beginner', muscleGroup: 'Quads', equipment: 'Barbell', steps: 6, isPublished: true },
  { id: '5', name: 'Bicep Curl', category: 'Arms', difficulty: 'Beginner', muscleGroup: 'Biceps', equipment: 'Dumbbells', steps: 5, isPublished: true },
  { id: '6', name: 'Plank', category: 'Core', difficulty: 'Beginner', muscleGroup: 'Core', equipment: 'Bodyweight', steps: 5, isPublished: true },
  { id: '7', name: 'Treadmill Run', category: 'Cardio', difficulty: 'Beginner', muscleGroup: 'Full Body', equipment: 'Treadmill', steps: 5, isPublished: true },
  { id: '8', name: 'Deadlift', category: 'Back', difficulty: 'Advanced', muscleGroup: 'Posterior Chain', equipment: 'Barbell', steps: 6, isPublished: false },
  { id: '9', name: 'Lunges', category: 'Legs', difficulty: 'Beginner', muscleGroup: 'Quads & Glutes', equipment: 'Bodyweight', steps: 4, isPublished: true },
  { id: '10', name: 'Dumbbell Fly', category: 'Chest', difficulty: 'Intermediate', muscleGroup: 'Pectorals', equipment: 'Dumbbells', steps: 5, isPublished: false },
  { id: '11', name: 'Lat Pulldown', category: 'Back', difficulty: 'Beginner', muscleGroup: 'Lats', equipment: 'Cable Machine', steps: 5, isPublished: true },
  { id: '12', name: 'Russian Twist', category: 'Core', difficulty: 'Intermediate', muscleGroup: 'Obliques', equipment: 'Bodyweight', steps: 4, isPublished: true },
];

const CATEGORIES = ['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core', 'Cardio'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// ─── Columns ─────────────────────────────────────────────────────────────────

const columns: Column<Exercise>[] = [
  {
    key: 'name',
    header: 'Exercise',
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-4 h-4 text-accent" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{row.name}</p>
          <p className="text-xs text-gray-500">{row.muscleGroup}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    render: (val) => <Badge variant="outline" size="sm">{String(val)}</Badge>,
  },
  {
    key: 'difficulty',
    header: 'Difficulty',
    sortable: true,
    render: (val) => {
      const label = String(val);
      return (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', getDifficultyColor(label))}>
          {label}
        </span>
      );
    },
  },
  {
    key: 'equipment',
    header: 'Equipment',
    render: (val) => <span className="text-gray-400 text-sm">{String(val)}</span>,
  },
  {
    key: 'steps',
    header: 'Steps',
    sortable: true,
    render: (val) => <span className="font-mono text-white">{String(val)}</span>,
  },
  {
    key: 'isPublished',
    header: 'Status',
    render: (val) =>
      val ? <Badge variant="success" size="sm">Published</Badge>
          : <Badge variant="warning" size="sm">Draft</Badge>,
  },
  {
    key: 'id',
    header: 'Actions',
    render: (_, row) => <RowActions row={row} />,
  },
];

function RowActions({ row }: { row: Exercise }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost">Edit</Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={() => setConfirmOpen(true)}
        >
          Delete
        </Button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="Delete Exercise"
        description={`Delete "${row.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExercisesPage() {
  const [category, setCategory] = React.useState('All');
  const [difficulty, setDifficulty] = React.useState('All');

  const filtered = MOCK_EXERCISES.filter((e) => {
    const catMatch = category === 'All' || e.category === category;
    const diffMatch = difficulty === 'All' || e.difficulty === difficulty;
    return catMatch && diffMatch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exercises"
        description="Manage exercise library, instructions, and difficulty levels."
      >
        <Button size="sm">
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
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  category === cat
                    ? 'bg-accent text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
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
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  difficulty === d
                    ? 'bg-accent text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="No exercises found"
          description="Try adjusting the filters or add a new exercise."
          action={<Button size="sm"><Plus className="w-4 h-4" /> Add Exercise</Button>}
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
            row.muscleGroup.toLowerCase().includes(q) ||
            row.equipment.toLowerCase().includes(q)
          }
        />
      )}
    </div>
  );
}
