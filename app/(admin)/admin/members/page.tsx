"use client";

import * as React from "react";
import { Users, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Column } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { getInitials, getStatusColor, cn, formatDate } from "@/lib/utils";
import { getMembers, getMemberById, updateMemberProfile } from "@/lib/actions/members";
import type { Profile, Subscription, MembershipPlan } from "@/types";

type MemberWithSubs = Profile & {
  subscriptions?: (Subscription & { plan?: MembershipPlan })[];
};

function MemberAvatar({ name }: { name: string }) {
  const initials = getInitials(name);
  const colors = [
    "bg-red-500/20 text-red-400",
    "bg-blue-500/20 text-blue-400",
    "bg-green-500/20 text-green-400",
    "bg-yellow-500/20 text-yellow-400",
    "bg-purple-500/20 text-purple-400",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0", color)}>
      {initials}
    </div>
  );
}

export default function MembersPage() {
  const { toast } = useToast();
  const [members, setMembers] = React.useState<MemberWithSubs[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [selectedMember, setSelectedMember] = React.useState<MemberWithSubs | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [editingName, setEditingName] = React.useState(false);
  const [editName, setEditName] = React.useState("");
  const [editPhone, setEditPhone] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    getMembers()
      .then((data) => setMembers(data as unknown as MemberWithSubs[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getMemberStatus = (member: MemberWithSubs): string => {
    const subs = member.subscriptions;
    if (!subs || subs.length === 0) return "inactive";
    const active = subs.find(
      (s) =>
        s.payment_status === "paid" &&
        new Date(s.expires_at) >= new Date()
    );
    if (active) return "active";
    const expired = subs.find((s) => new Date(s.expires_at) < new Date());
    if (expired) return "expired";
    const pending = subs.find((s) => s.payment_status === "pending");
    if (pending) return "pending";
    return "inactive";
  };

  const getLatestPlan = (member: MemberWithSubs): string => {
    const subs = member.subscriptions;
    if (!subs || subs.length === 0) return "—";
    return subs[0]?.plan?.name || "—";
  };

  const getExpiryDate = (member: MemberWithSubs): string | null => {
    const subs = member.subscriptions;
    if (!subs || subs.length === 0) return null;
    const active = subs.find((s) => s.payment_status === "paid");
    return active?.expires_at || null;
  };

  const filtered = members.filter((m) => {
    if (statusFilter === "All") return true;
    return getMemberStatus(m) === statusFilter;
  });

  const handleViewMember = async (member: MemberWithSubs) => {
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const full = await getMemberById(member.id);
      setSelectedMember(full as unknown as MemberWithSubs);
    } catch {
      setSelectedMember(member);
    } finally {
      setDetailLoading(false);
    }
    setEditingName(false);
    setEditName(member.full_name || "");
    setEditPhone(member.phone || "");
  };

  const handleSaveProfile = async () => {
    if (!selectedMember) return;
    setSaving(true);
    try {
      await updateMemberProfile(selectedMember.id, {
        full_name: editName.trim() || undefined,
        phone: editPhone.trim() || undefined,
      });
      setMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? { ...m, full_name: editName.trim(), phone: editPhone.trim() }
            : m
        )
      );
      setSelectedMember((prev) =>
        prev ? { ...prev, full_name: editName.trim(), phone: editPhone.trim() } : prev
      );
      setEditingName(false);
      toast({ title: "Profile updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<MemberWithSubs>[] = [
    {
      key: "full_name",
      header: "Member",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <MemberAvatar name={row.full_name || row.id} />
          <div>
            <p className="font-semibold text-white text-sm">{row.full_name || "Unnamed"}</p>
            <p className="text-xs text-gray-500">ID: {row.id.slice(0, 8)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (val) => (
        <span className="text-gray-400 text-sm font-mono">{val ? String(val) : "—"}</span>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (_, row) => (
        <Badge variant="info" size="sm">{getLatestPlan(row)}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => {
        const label = getMemberStatus(row);
        const cls = getStatusColor(label);
        return (
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", cls)}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </span>
        );
      },
    },
    {
      key: "expires",
      header: "Expires",
      render: (_, row) => {
        const date = getExpiryDate(row);
        if (!date) return <span className="text-gray-500 text-sm">—</span>;
        const isExpired = new Date(date) < new Date();
        return (
          <span className={isExpired ? "text-red-400 text-sm" : "text-gray-400 text-sm"}>
            {formatDate(date)}
          </span>
        );
      },
    },
    {
      key: "id",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            aria-label={`View ${row.full_name || row.id}`}
            onClick={() => handleViewMember(row)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label={`Edit ${row.full_name || row.id}`}
            onClick={() => {
              handleViewMember(row);
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const activeCount = members.filter((m) => getMemberStatus(m) === "active").length;
  const expiredCount = members.filter((m) => getMemberStatus(m) === "expired").length;
  const pendingCount = members.filter((m) => getMemberStatus(m) === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="View and manage gym members, subscriptions, and profiles."
      />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "All", count: members.length, value: "All" },
          { label: "Active", count: activeCount, value: "active" },
          { label: "Expired", count: expiredCount, value: "expired" },
          { label: "Pending", count: pendingCount, value: "pending" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setStatusFilter(item.value)}
            aria-pressed={statusFilter === item.value}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
              statusFilter === item.value
                ? "bg-accent/15 text-white border-accent/40"
                : "bg-white/3 text-gray-400 border-white/8 hover:border-white/15 hover:text-white"
            )}
          >
            {item.label}
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-md font-bold",
                statusFilter === item.value
                  ? "bg-accent/30 text-white"
                  : "bg-white/10 text-gray-500"
              )}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" aria-label="Loading…" />
        </div>
      ) : filtered.length === 0 ? (
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
          pageSize={10}
          filterFn={(row, q) =>
            (row.full_name ?? "").toLowerCase().includes(q)
          }
        />
      )}

      {/* Member Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedMember(null);
        }}
        title={selectedMember?.full_name || "Member Profile"}
        size="lg"
      >
        {detailLoading || !selectedMember ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-accent animate-spin" aria-label="Loading…" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <MemberAvatar name={selectedMember.full_name || selectedMember.id} />
              <div>
                <p className="text-lg font-bold text-white">{selectedMember.full_name || "Unnamed"}</p>
                <p className="text-sm text-gray-400">Member since {formatDate(selectedMember.created_at)}</p>
              </div>
            </div>

            {editingName ? (
              <div className="space-y-3">
                <Input
                  label="Full Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <Input
                  label="Phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingName(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" loading={saving} onClick={handleSaveProfile}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm text-white">{selectedMember.phone || "—"}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <p className="text-sm text-white capitalize">{selectedMember.role}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm text-white capitalize">{getMemberStatus(selectedMember)}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Joined</p>
                  <p className="text-sm text-white">{formatDate(selectedMember.created_at)}</p>
                </div>
              </div>
            )}

            {!editingName && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingName(true);
                  setEditName(selectedMember.full_name || "");
                  setEditPhone(selectedMember.phone || "");
                }}
              >
                Edit Profile
              </Button>
            )}

            {/* Subscriptions */}
            {selectedMember.subscriptions && selectedMember.subscriptions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Subscriptions</h3>
                <div className="space-y-2">
                  {selectedMember.subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/8"
                    >
                      <div>
                        <p className="text-sm text-white font-semibold">
                          {sub.plan?.name || "Unknown Plan"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(sub.starts_at)} – {formatDate(sub.expires_at)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          getStatusColor(sub.payment_status)
                        )}
                      >
                        {sub.payment_status.charAt(0).toUpperCase() + sub.payment_status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
