'use client';

import * as React from 'react';
import { CreditCard, Plus, Edit2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { DashboardCard } from '@/components/admin/DashboardCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/admin/StatCard';
import { Column } from '@/components/ui/Table';
import { getStatusColor, cn } from '@/lib/utils';

// ─── Mock data ────────────────────────────────────────────────────────────────

type Plan = {
  id: string;
  name: string;
  durationMonths: number;
  priceInr: number;
  savings: string | null;
  isFeatured: boolean;
  isActive: boolean;
  activeSubscriptions: number;
};

const PLANS: Plan[] = [
  { id: '1', name: '1 Month', durationMonths: 1, priceInr: 1500, savings: null, isFeatured: false, isActive: true, activeSubscriptions: 12 },
  { id: '2', name: '3 Months', durationMonths: 3, priceInr: 4000, savings: 'Save ₹500', isFeatured: false, isActive: true, activeSubscriptions: 28 },
  { id: '3', name: '6 Months', durationMonths: 6, priceInr: 7000, savings: 'Save ₹2000', isFeatured: true, isActive: true, activeSubscriptions: 41 },
  { id: '4', name: '12 Months', durationMonths: 12, priceInr: 9000, savings: 'Save ₹9000', isFeatured: false, isActive: true, activeSubscriptions: 19 },
];

type Subscription = {
  id: string;
  memberName: string;
  email: string;
  plan: string;
  status: string;
  startDate: string;
  expiryDate: string;
  amount: string;
};

const MOCK_SUBS: Subscription[] = [
  { id: '1', memberName: 'Arjun Mehta', email: 'arjun@example.com', plan: '6 Months', status: 'paid', startDate: '2026-01-15', expiryDate: '2026-07-15', amount: '₹7,000' },
  { id: '2', memberName: 'Priya Sharma', email: 'priya@example.com', plan: '12 Months', status: 'paid', startDate: '2025-07-01', expiryDate: '2026-07-01', amount: '₹9,000' },
  { id: '3', memberName: 'Ravi Patel', email: 'ravi@example.com', plan: '1 Month', status: 'cancelled', startDate: '2026-05-10', expiryDate: '2026-06-10', amount: '₹1,500' },
  { id: '4', memberName: 'Sneha Kapoor', email: 'sneha@example.com', plan: '3 Months', status: 'paid', startDate: '2026-04-20', expiryDate: '2026-07-20', amount: '₹4,000' },
  { id: '5', memberName: 'Amit Singh', email: 'amit@example.com', plan: '12 Months', status: 'paid', startDate: '2026-02-01', expiryDate: '2027-02-01', amount: '₹9,000' },
  { id: '6', memberName: 'Dhruv Shah', email: 'dhruv@example.com', plan: '3 Months', status: 'pending', startDate: '2026-07-01', expiryDate: '2026-10-01', amount: '₹4,000' },
];

const subColumns: Column<Subscription>[] = [
  {
    key: 'memberName',
    header: 'Member',
    sortable: true,
    render: (_, row) => (
      <div>
        <p className="font-semibold text-white text-sm">{row.memberName}</p>
        <p className="text-xs text-gray-500">{row.email}</p>
      </div>
    ),
  },
  {
    key: 'plan',
    header: 'Plan',
    sortable: true,
    render: (val) => <Badge variant="info" size="sm">{String(val)}</Badge>,
  },
  {
    key: 'status',
    header: 'Payment',
    render: (val) => {
      const label = String(val);
      return (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', getStatusColor(label))}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      );
    },
  },
  {
    key: 'startDate',
    header: 'Started',
    sortable: true,
    render: (val) => (
      <span className="text-gray-400 text-sm">
        {new Date(String(val)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    ),
  },
  {
    key: 'expiryDate',
    header: 'Expires',
    sortable: true,
    render: (val) => {
      const d = new Date(String(val));
      const isExpired = d < new Date();
      return (
        <span className={isExpired ? 'text-red-400 text-sm' : 'text-gray-400 text-sm'}>
          {d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      );
    },
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (val) => <span className="font-mono font-semibold text-white">{String(val)}</span>,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembershipsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Memberships"
        description="Manage membership plans and track active subscriptions."
      >
        <Button size="sm">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Plan
        </Button>
      </PageHeader>

      {/* Plan stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => (
          <StatCard
            key={plan.id}
            title={plan.name}
            value={plan.activeSubscriptions}
            subtitle={`₹${plan.priceInr.toLocaleString('en-IN')}`}
            icon={<CreditCard className="w-6 h-6" />}
          />
        ))}
      </div>

      {/* Plan cards */}
      <section aria-labelledby="plans-heading">
        <h2 id="plans-heading" className="text-lg font-bold text-white mb-4">
          Pricing Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-2xl p-6 border transition-all duration-200',
                plan.isFeatured
                  ? 'bg-accent/5 border-accent/40'
                  : 'bg-[#111] border-white/8'
              )}
            >
              {plan.isFeatured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              {plan.savings && (
                <Badge variant="success" size="sm" className="mb-3">{plan.savings}</Badge>
              )}
              <p className="text-sm font-semibold text-gray-300 mb-1">{plan.name}</p>
              <p className="text-3xl font-black text-white mb-4">
                ₹{plan.priceInr.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {plan.activeSubscriptions} active subscriber{plan.activeSubscriptions !== 1 ? 's' : ''}
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                Edit Plan
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Subscriptions table */}
      <section aria-labelledby="subs-heading">
        <DashboardCard title="Recent Subscriptions">
          <DataTable
            columns={subColumns}
            data={MOCK_SUBS}
            keyExtractor={(r) => r.id}
            searchPlaceholder="Search by name or plan…"
            pageSize={6}
            filterFn={(row, q) =>
              row.memberName.toLowerCase().includes(q) ||
              row.plan.toLowerCase().includes(q) ||
              row.status.toLowerCase().includes(q)
            }
          />
        </DashboardCard>
      </section>
    </div>
  );
}
