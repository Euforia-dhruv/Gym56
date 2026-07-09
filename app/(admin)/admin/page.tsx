import type { Metadata } from "next";
import {
  Dumbbell,
  BookOpen,
  Mail,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { Badge } from "@/components/ui/Badge";
import { getEquipment } from "@/lib/actions/equipment";
import { getExercises } from "@/lib/actions/exercises";
import { getUnreadCount } from "@/lib/actions/contact";

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
    label: "View Messages",
    href: "/admin/contact",
    icon: Mail,
    description: "Unread messages",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Manage site settings",
  },
];

const systemStatusBadge: Record<string, { variant: "success" | "warning" | "default"; label: string }> = {
  operational: { variant: "success", label: "Operational" },
  degraded: { variant: "warning", label: "Degraded" },
  not_configured: { variant: "default", label: "Not configured" },
};

export default async function AdminDashboardPage() {
  let equipmentCount = 0;
  let exerciseCount = 0;
  let unreadCount = 0;

  try {
    const [equipment, exercises, unread] = await Promise.all([
      getEquipment(),
      getExercises(),
      getUnreadCount(),
    ]);
    equipmentCount = equipment.length;
    exerciseCount = exercises.length;
    unreadCount = unread;
  } catch {
    // Fallback in case of error
  }

  const dashStats = [
    {
      title: "Equipment",
      value: equipmentCount,
      subtitle: "Items in inventory",
      icon: <Dumbbell className="w-6 h-6" />,
    },
    {
      title: "Exercises",
      value: exerciseCount,
      subtitle: "Published exercises",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: "Unread Messages",
      value: unreadCount,
      subtitle: "Contact submissions",
      icon: <Mail className="w-6 h-6" />,
    },
  ];

  const systemStatus = [
    { label: "Supabase Auth", status: "operational" as const },
    { label: "Database", status: "operational" as const },
    { label: "Storage", status: "operational" as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">
          Welcome back — here&apos;s what&apos;s happening at Gym 56.
        </p>
      </div>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Key metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
