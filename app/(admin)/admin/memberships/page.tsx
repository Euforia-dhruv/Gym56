"use client";

import * as React from "react";
import { CreditCard, Plus, Edit2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/admin/StatCard";
import { MembershipPlanForm } from "@/components/admin/MembershipPlanForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Column } from "@/components/ui/Table";
import { getStatusColor, cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  getMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
  getSubscriptions,
  getSubscriptionCounts,
} from "@/lib/actions/memberships";
import type { MembershipPlan, Subscription } from "@/types";

export default function MembershipsPage() {
  const [plans, setPlans] = React.useState<MembershipPlan[]>([]);
  interface SubscriptionRow extends Subscription {
    plan?: MembershipPlan;
    profile?: { id: string; full_name: string | null; email: string | null };
  }
  const [subscriptions, setSubscriptions] = React.useState<SubscriptionRow[]>([]);
  const [subCounts, setSubCounts] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MembershipPlan | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<MembershipPlan | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      getMembershipPlans(),
      getSubscriptions(),
      getSubscriptionCounts(),
    ])
      .then(([plansData, subsData, counts]) => {
        setPlans(plansData);
        setSubscriptions(subsData as typeof subscriptions);
        setSubCounts(counts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (data: Parameters<typeof createMembershipPlan>[0]) => {
    const created = await createMembershipPlan(data);
    setPlans((prev) => [...prev, created]);
    setModalOpen(false);
  };

  const handleUpdate = async (data: Parameters<typeof updateMembershipPlan>[0]) => {
    if (!editing) return;
    const updated = await updateMembershipPlan(data);
    setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteMembershipPlan(deleteConfirm.id);
      setPlans((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const subColumns: Column<SubscriptionRow>[] = [
    {
      key: "profile",
      header: "Member",
      render: (_, row) => (
        <div>
          <p className="font-semibold text-white text-sm">
            {row.profile?.full_name || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">{row.profile?.email}</p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (_, row) => (
        <Badge variant="info" size="sm">
          {row.plan?.name || "Unknown"}
        </Badge>
      ),
    },
    {
      key: "payment_status",
      header: "Payment",
      render: (val) => {
        const label = String(val);
        return (
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", getStatusColor(label))}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </span>
        );
      },
    },
    {
      key: "starts_at",
      header: "Started",
      sortable: true,
      render: (val) => (
        <span className="text-gray-400 text-sm">{formatDate(String(val))}</span>
      ),
    },
    {
      key: "expires_at",
      header: "Expires",
      sortable: true,
      render: (val) => {
        const isExpired = new Date(String(val)) < new Date();
        return (
          <span className={isExpired ? "text-red-400 text-sm" : "text-gray-400 text-sm"}>
            {formatDate(String(val))}
          </span>
        );
      },
    },
    {
      key: "amount_paid_minor",
      header: "Amount",
      render: (val) => (
        <span className="font-mono font-semibold text-white">
          {val ? formatCurrency(Number(val)) : "—"}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-accent animate-spin" aria-label="Loading…" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Memberships"
        description="Manage membership plans and track active subscriptions."
      >
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Plan
        </Button>
      </PageHeader>

      {/* Plan stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <StatCard
            key={plan.id}
            title={plan.name}
            value={subCounts[plan.id] ?? 0}
            subtitle={formatCurrency(plan.price_minor, plan.currency)}
            icon={<CreditCard className="w-6 h-6" />}
          />
        ))}
      </div>

      {/* Plan cards */}
      <section aria-labelledby="plans-heading">
        <h2 id="plans-heading" className="text-lg font-bold text-white mb-4">
          Pricing Plans
        </h2>
        <div           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-6 border transition-all duration-200",
                plan.is_featured
                  ? "bg-accent/5 border-accent/40"
                  : "bg-[#111] border-white/8"
              )}
            >
              {plan.is_featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              {plan.savings_label && (
                <Badge variant="success" size="sm" className="mb-3">{plan.savings_label}</Badge>
              )}
              <p className="text-sm font-semibold text-gray-300 mb-1">{plan.name}</p>
              <p className="text-3xl font-black text-white mb-4">
                {formatCurrency(plan.price_minor, plan.currency)}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {subCounts[plan.id] ?? 0} active subscriber{(subCounts[plan.id] ?? 0) !== 1 ? "s" : ""}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEditing(plan);
                  setModalOpen(true);
                }}
              >
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
            data={subscriptions.slice(0, 50)}
            keyExtractor={(r) => r.id}
            searchPlaceholder="Search by name or plan…"
            pageSize={10}
            filterFn={(row, q) => {
              const r = row as unknown as SubscriptionRow;
              const name = r.profile?.full_name ?? "";
              const plan = r.plan?.name ?? "";
              return name.toLowerCase().includes(q) || plan.toLowerCase().includes(q);
            }}
          />
        </DashboardCard>
      </section>

      {/* Create/Edit Plan Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Plan" : "Add Plan"}
        description={editing ? `Editing "${editing.name}"` : "Create a new membership plan"}
        size="lg"
      >
        <MembershipPlanForm
          plan={editing}
          onSubmit={async (data) => {
            if (editing) {
              await handleUpdate(data as Parameters<typeof updateMembershipPlan>[0]);
            } else {
              await handleCreate(data as Parameters<typeof createMembershipPlan>[0]);
            }
          }}
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
        title="Delete Plan"
        description={`Delete "${deleteConfirm?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
