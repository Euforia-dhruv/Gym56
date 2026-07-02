import type { Metadata } from "next";
import {
  Users,
  Dumbbell,
  BookOpen,
  CreditCard,
  Mail,
  IndianRupee,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Gym 56 admin dashboard overview.",
};

// ─── Mock data ───────────────────────────────────────────────────────────────

const stats = [
  {
    title: "Total Members",
    value: "124",
    subtitle: "Registered accounts",
    icon: <Users className="w-6 h-6" />,
    trend: { value: 12, label: "vs last month" },
  },
  {
    title: "Equipment",
    value: "38",
    subtitle: "Items in inventory",
    icon: <Dumbbell className="w-6 h-6" />,
    trend: { value: 5, label: "2 added recently" },
  },
  {
    title: "Exercises",
    value: "47",
    subtitle: "Published exercises",
    icon: <BookOpen className="w-6 h-6" />,
    trend: { value: 0, label: "No change" },
  },
  {
    title: "Active Plans",
    value: "89",
    subtitle: "Active subscriptions",
    icon: <CreditCard className="w-6 h-6" />,
    trend: { value: 8, label: "vs last month" },
  },
  {
    title: "Unread Messages",
    value: "3",
    subtitle: "Contact submissions",
    icon: <Mail className="w-6 h-6" />,
    trend: { value: -2, label: "vs yesterday" },
  },
  {
    title: "Revenue (Month)",
    value: "₹1.2L",
    subtitle: "Estimated — payments coming soon",
    icon: <IndianRupee className="w-6 h-6" />,
    trend: { value: 18, label: "vs last month" },
  },
];

const recentActivity = [
  {
    id: "1",
    type: "member",
    message: "New member registered: Arjun Mehta",
    time: "5 minutes ago",
    status: "success",
  },
  {
    id: "2",
    type: "membership",
    message: "Priya Sharma renewed 6-month plan",
    time: "23 minutes ago",
    status: "success",
  },
  {
    id: "3",
    type: "contact",
    message: "New contact message from Ravi Patel",
    time: "1 hour ago",
    status: "info",
  },
  {
    id: "4",
    type: "equipment",
    message: "Treadmill #3 marked for maintenance",
    time: "2 hours ago",
    status: "warning",
  },
  {
    id: "5",
    type: "member",
    message: "Sneha Kapoor membership expired",
    time: "3 hours ago",
    status: "error",
  },
  {
    id: "6",
    type: "membership",
    message: "Amit Singh purchased 12-month plan",
    time: "5 hours ago",
    status: "success",
  },
];

const systemStatus = [
  { label: "Supabase Auth", status: "operational" },
  { label: "Database", status: "operational" },
  { label: "Storage", status: "operational" },
  { label: "Payment Gateway", status: "not_configured" },
  { label: "AI Coach", status: "not_configured" },
];

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
    description: "3 unread messages",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const activityStatusIcon: Record<string, React.ReactNode> = {
  success: (
    <CheckCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
  ),
  info: <Clock className="w-4 h-4 text-blue-400" aria-hidden="true" />,
  warning: (
    <AlertCircle className="w-4 h-4 text-yellow-400" aria-hidden="true" />
  ),
  error: <AlertCircle className="w-4 h-4 text-red-400" aria-hidden="true" />,
};

const systemStatusBadge: Record<
  string,
  { variant: "success" | "warning" | "default"; label: string }
> = {
  operational: { variant: "success", label: "Operational" },
  degraded: { variant: "warning", label: "Degraded" },
  not_configured: { variant: "default", label: "Not configured" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back — here&apos;s what&apos;s happening at Gym 56.
        </p>
      </div>

      {/* Stat cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Key metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2
          id="quick-actions-heading"
          className="text-lg font-bold text-white mb-4"
        >
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
                <p className="text-xs text-gray-500 truncate">
                  {action.description}
                </p>
              </div>
              <ArrowRight
                className="w-4 h-4 text-gray-600 group-hover:text-accent ml-auto flex-shrink-0 transition-all group-hover:translate-x-1 duration-200"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom grid: Activity + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <section aria-labelledby="activity-heading" className="lg:col-span-2">
          <DashboardCard
            title="Recent Activity"
            action={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/members">
                  View all{" "}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                </Link>
              </Button>
            }
          >
            <ul className="space-y-1" aria-labelledby="activity-heading">
              {recentActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-white/3 transition-colors"
                >
                  <span className="flex-shrink-0">
                    {activityStatusIcon[item.status]}
                  </span>
                  <span className="flex-1 text-sm text-gray-300 min-w-0 truncate">
                    {item.message}
                  </span>
                  <span className="flex-shrink-0 text-xs text-gray-600 whitespace-nowrap">
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </DashboardCard>
        </section>

        {/* System Status */}
        <section aria-labelledby="system-heading">
          <DashboardCard title="System Status">
            <ul className="space-y-3" aria-labelledby="system-heading">
              {systemStatus.map((item) => {
                const { variant, label } = systemStatusBadge[item.status];
                return (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <Badge variant={variant} dot size="sm">
                      {label}
                    </Badge>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 pt-4 border-t border-white/8">
              <p className="text-xs text-gray-600 text-center">
                All core systems operational
              </p>
            </div>
          </DashboardCard>
        </section>
      </div>

      {/* Placeholder banners for upcoming features */}
      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="text-lg font-bold text-white mb-4">
          Coming in Sprint 2
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Equipment CMS",
              desc: "Full CRUD with image upload",
              sprint: "2A",
            },
            {
              label: "Member Dashboard",
              desc: "Profiles, subscriptions, classes",
              sprint: "2B",
            },
            {
              label: "AI Coach",
              desc: "Context-aware fitness guidance",
              sprint: "2E",
            },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-start gap-3 p-4 rounded-2xl border border-dashed border-white/10 bg-white/2"
            >
              <span className="flex-shrink-0 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-lg">
                {f.sprint}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{f.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
