'use client';

import * as React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Column } from '@/components/ui/Table';
import { getInitials, getStatusColor, cn } from '@/lib/utils';

// ─── Mock data ────────────────────────────────────────────────────────────────

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: string;
  joinedAt: string;
  expiresAt: string;
};

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 98765 11111', plan: '6 Months', status: 'active', joinedAt: '2026-01-15', expiresAt: '2026-07-15' },
  { id: '2', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 22222', plan: '12 Months', status: 'active', joinedAt: '2025-07-01', expiresAt: '2026-07-01' },
  { id: '3', name: 'Ravi Patel', email: 'ravi@example.com', phone: '+91 98765 33333', plan: '1 Month', status: 'expired', joinedAt: '2026-05-10', expiresAt: '2026-06-10' },
  { id: '4', name: 'Sneha Kapoor', email: 'sneha@example.com', phone: '+91 98765 44444', plan: '3 Months', status: 'active', joinedAt: '2026-04-20', expiresAt: '2026-07-20' },
  { id: '5', name: 'Amit Singh', email: 'amit@example.com', phone: '+91 98765 55555', plan: '12 Months', status: 'active', joinedAt: '2026-02-01', expiresAt: '2027-02-01' },
  { id: '6', name: 'Kavya Nair', email: 'kavya@example.com', phone: '+91 98765 66666', plan: '6 Months', status: 'active', joinedAt: '2026-03-10', expiresAt: '2026-09-10' },
  { id: '7', name: 'Dhruv Shah', email: 'dhruv@example.com', phone: '+91 98765 77777', plan: '3 Months', status: 'pending', joinedAt: '2026-07-01', expiresAt: '2026-10-01' },
  { id: '8', name: 'Meera Joshi', email: 'meera@example.com', phone: '+91 98765 88888', plan: '1 Month', status: 'expired', joinedAt: '2026-05-01', expiresAt: '2026-06-01' },
  { id: '9', name: 'Karan Verma', email: 'karan@example.com', phone: '+91 98765 99999', plan: '6 Months', status: 'active', joinedAt: '2026-01-20', expiresAt: '2026-07-20' },
  { id: '10', name: 'Ananya Rao', email: 'ananya@example.com', phone: '+91 98765 10101', plan: '12 Months', status: 'active', joinedAt: '2025-09-01', expiresAt: '2026-09-01' },
];

// ─── Avatar ───────────────────────────────────────────────────────────────────

function MemberAvatar({ name }: { name: string }) {
  const initials = getInitials(name);
  const colors = [
    'bg-red-500/20 text-red-400',
    'bg-blue-500/20 text-blue-400',
    'bg-green-500/20 text-green-400',
    'bg-yellow-500/20 text-yellow-400',
    'bg-purple-500/20 text-purple-400',
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0', color)}>
      {initials}
    </div>
  );
}

// ─── Columns ─────────────────────────────────────────────────────────────────

const columns: Column<Member>[] = [
  {
    key: 'name',
    header: 'Member',
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <MemberAvatar name={row.name} />
        <div>
          <p className="font-semibold text-white text-sm">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Phone',
    render: (val) => <span className="text-gray-400 text-sm font-mono">{String(val)}</span>,
  },
  {
    key: 'plan',
    header: 'Plan',
    sortable: true,
    render: (val) => <Badge variant="info" size="sm">{String(val)}</Badge>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (val) => {
      const label = String(val);
      const cls = getStatusColor(label);
      return (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', cls)}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      );
    },
  },
  {
    key: 'expiresAt',
    header: 'Expires',
    sortable: true,
    render: (val) => {
      const date = new Date(String(val));
      const isExpired = date < new Date();
      return (
        <span className={isExpired ? 'text-red-400 text-sm' : 'text-gray-400 text-sm'}>
          {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      );
    },
  },
  {
    key: 'id',
    header: 'Actions',
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" aria-label={`View ${row.name}`}>View</Button>
        <Button size="sm" variant="ghost" aria-label={`Edit ${row.name}`}>Edit</Button>
      </div>
    ),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
  const [statusFilter, setStatusFilter] = React.useState('All');

  const filtered = statusFilter === 'All'
    ? MOCK_MEMBERS
    : MOCK_MEMBERS.filter((m) => m.status === statusFilter);

  const activeCount = MOCK_MEMBERS.filter((m) => m.status === 'active').length;
  const expiredCount = MOCK_MEMBERS.filter((m) => m.status === 'expired').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="View and manage gym members, subscriptions, and profiles."
      >
        <Button size="sm">
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          Add Member
        </Button>
      </PageHeader>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'All', count: MOCK_MEMBERS.length, value: 'All' },
          { label: 'Active', count: activeCount, value: 'active' },
          { label: 'Expired', count: expiredCount, value: 'expired' },
          { label: 'Pending', count: MOCK_MEMBERS.filter(m => m.status === 'pending').length, value: 'pending' },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setStatusFilter(item.value)}
            aria-pressed={statusFilter === item.value}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border',
              statusFilter === item.value
                ? 'bg-accent/15 text-white border-accent/40'
                : 'bg-white/3 text-gray-400 border-white/8 hover:border-white/15 hover:text-white'
            )}
          >
            {item.label}
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-md font-bold',
              statusFilter === item.value ? 'bg-accent/30 text-white' : 'bg-white/10 text-gray-500'
            )}>
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No members found"
          description="No members match the current filter."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search members by name or email…"
          pageSize={8}
          filterFn={(row, q) =>
            row.name.toLowerCase().includes(q) ||
            row.email.toLowerCase().includes(q) ||
            row.plan.toLowerCase().includes(q)
          }
        />
      )}
    </div>
  );
}
