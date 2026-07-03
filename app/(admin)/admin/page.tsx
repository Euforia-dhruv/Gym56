import type { Metadata } from "next";
import {
  Users,
  Dumbbell,
  BookOpen,
  CreditCard,
  Mail,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getDashboardStats } from "@/lib/actions/members";
import { getUnreadCount } from "@/lib/actions/contact";
import { getActivePlans, getSubscriptionCounts } from "@/lib/actions/memberships";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Gym 56 admin dashboard overview.",
};

const quickActions = [
  {
    label: "Add Equipment",
    href: "/admin/equipment",
    icon: Dumbbell,
    description: "Add new gym equipment",
  },
  {
    label: "Add Exercise",
    href: "/admin/exercises",
    icon: BookOpen,
    description: "Create exercise guide",
  },
  {
    label: "View Members",
    href: "/admin/members",
    icon: Users,
    description: "Manage gym members",
  },
  {
    label: "View Messages",
    href: "/admin/contact",
    icon: Mail,
    description: "Unread messages",
  },
];


const systemStatusBadge: Record<string, { variant: "success" | "warning" | "default"; label: string }> = {
  operational: { variant: "success", label: "Operational" },
  degraded: { variant: "warning", label: "Degraded" },
  not_configured: { variant: "default", label: "Not configured" },
};

// ─── Server Component ───────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  let stats;
  let unreadCount;
  let plans;

  try {
    const [s, u, p] = await Promise.all([
      getDashboardStats(),
      getUnreadCount(),
      getActivePlans(),
    ]);
    stats = s;
    unreadCount = u;
    plans = p;
  } catch {
    // Fallback in case of error
    stats = {
      totalMembers: 0,
      totalEquipment: 0,
      totalExercises: 0,
      activeSubscriptions: 0,
      unreadMessages: 0,
    };
    unreadCount = 0;
    plans = [];
  }

  const planCounts: Record<string, number> = {};
  try {
    const counts = await getSubscriptionCounts();
    Object.assign(planCounts, counts);
  } catch {
    // Fallback
  }

  const dashStats = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      subtitle: "Registered accounts",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Equipment",
      value: stats.totalEquipment,
      subtitle: "Items in inventory",
      icon: <Dumbbell className="w-6 h-6" />,
    },
    {
      title: "Exercises",
      value: stats.totalExercises,
      subtitle: "Published exercises",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: "Active Plans",
      value: stats.activeSubscriptions,
      subtitle: "Active subscriptions",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      title: "Unread Messages",
      value: unreadCount,
      subtitle: "Contact submissions",
      icon: <Mail className="w-6 h-6" />,
    },
    {
      title: "Pricing Plans",
      value: plans.length,
      subtitle: "Membership plans available",
      icon: <IndianRupee className="w-6 h-6" />,
    },
  ];

  const systemStatus = [
    { label: "Supabase Auth", status: "operational" as const },
    { label: "Database", status: "operational" as const },
    { label: "Storage", status: "operational" as const },
    { label: "Payment Gateway", status: "not_configured" as const },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back — here&apos;s what&apos;s happening at Gym 56.
        </p>
      </div>

      {/* Stat cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Key metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-lg font-bold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-[#111] border border-white/8 hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center text-accent transition-colors flex-shrink-0">
                <action.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500 truncate">{action.description}</p>
              </div>
              <ArrowRight
                className="w-4 h-4 text-gray-600 group-hover:text-accent ml-auto flex-shrink-0 transition-all group-hover:translate-x-1 duration-200"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <section aria-labelledby="activity-heading" className="lg:col-span-2">
          <DashboardCard
            title="Pricing Plans"
            action={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/memberships">
                  View all <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3 p-2">
              {plans.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No plans created yet.</p>
              ) : (
                plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/8"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{plan.name}</p>
                      <p className="text-xs text-gray-500">
                        {planCounts[plan.id] ?? 0} active subscriber{(planCounts[plan.id] ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(plan.price_minor, plan.currency)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>
        </section>

        {/* System Status */}
        <section aria-labelledby="system-heading">
          <DashboardCard title="System Status">
            <ul className="space-y-3" aria-labelledby="system-heading">
              {systemStatus.map((item) => {
                const { variant, label } = systemStatusBadge[item.status];
                return (
                  <li key={item.label} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <Badge variant={variant} dot size="sm">
                      {label}
                    </Badge>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 pt-4 border-t border-white/8">
              <p className="text-xs text-gray-600 text-center">All core systems operational</p>
            </div>
          </DashboardCard>
        </section>
      </div>
    </div>
  );
}
