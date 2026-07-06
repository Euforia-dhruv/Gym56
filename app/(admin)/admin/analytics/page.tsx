"use client";

import * as React from "react";
import {
  IndianRupee,
  Users,
  UserPlus,
  TrendingUp,
  Heart,
  Activity,
  Loader2,
  Dumbbell,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "gym56_analytics";

interface AnalyticsData {
  totalRevenue: number;
  activeMembers: number;
  newMembersMonth: number;
  avgSessionRate: number;
  memberRetention: number;
  monthlyGrowth: number;
  monthlyRevenue: { month: string; revenue: number }[];
  memberGrowth: { month: string; count: number }[];
  popularEquipment: { name: string; count: number }[];
  categoryDistribution: { category: string; percentage: number }[];
}

function seedAnalytics(): AnalyticsData {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const idx = (currentMonth - 5 + i + 12) % 12;
    return months[idx];
  });
  return {
    totalRevenue: 5840000,
    activeMembers: 248,
    newMembersMonth: 32,
    avgSessionRate: 87,
    memberRetention: 94,
    monthlyGrowth: 8.5,
    monthlyRevenue: [
      { month: last6[0], revenue: 720000 },
      { month: last6[1], revenue: 810000 },
      { month: last6[2], revenue: 760000 },
      { month: last6[3], revenue: 920000 },
      { month: last6[4], revenue: 1050000 },
      { month: last6[5], revenue: 1120000 },
    ],
    memberGrowth: months.map((month, i) => ({
      month,
      count: 80 + i * 15 + Math.floor(Math.random() * 20),
    })),
    popularEquipment: [
      { name: "Treadmill", count: 142 },
      { name: "Dumbbells", count: 128 },
      { name: "Bench Press", count: 115 },
      { name: "Cable Machine", count: 98 },
      { name: "Leg Press", count: 87 },
      { name: "Rowing Machine", count: 72 },
    ],
    categoryDistribution: [
      { category: "Cardio", percentage: 35 },
      { category: "Strength", percentage: 28 },
      { category: "Free Weights", percentage: 20 },
      { category: "Functional", percentage: 12 },
      { category: "Recovery", percentage: 5 },
    ],
  };
}

function loadAnalytics(): AnalyticsData {
  if (typeof window === "undefined") return seedAnalytics();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as AnalyticsData;
    } catch {
      // fall through
    }
  }
  const data = seedAnalytics();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function formatIndian(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const d = loadAnalytics();
    setData(d);
    setLoading(false);
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-accent animate-spin" aria-label="Loading…" />
      </div>
    );
  }

  const maxRevenue = Math.max(...data.monthlyRevenue.map((r) => r.revenue));
  const maxEquipment = Math.max(...data.popularEquipment.map((e) => e.count));
  const maxMemberGrowth = Math.max(...data.memberGrowth.map((m) => m.count));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Track gym performance, revenue, and member growth metrics."
      />

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <StatCard
          title="Total Revenue"
          value={`₹${formatIndian(data.totalRevenue)}`}
          icon={<IndianRupee className="w-6 h-6" />}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Active Members"
          value={data.activeMembers}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 5, label: "vs last month" }}
        />
        <StatCard
          title="New Members (Month)"
          value={data.newMembersMonth}
          icon={<UserPlus className="w-6 h-6" />}
          trend={{ value: 8, label: "vs last month" }}
        />
        <StatCard
          title="Avg Session Rate"
          value={`${data.avgSessionRate}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: 3, label: "vs last month" }}
        />
        <StatCard
          title="Member Retention"
          value={`${data.memberRetention}%`}
          icon={<Heart className="w-6 h-6" />}
          trend={{ value: -1, label: "vs last month" }}
        />
        <StatCard
          title="Monthly Growth"
          value={`${data.monthlyGrowth}%`}
          icon={<Activity className="w-6 h-6" />}
          trend={{ value: 8.5 }}
        />
      </motion.div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Revenue</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {data.monthlyRevenue.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">₹{Math.round(item.revenue / 1000)}k</span>
                <div
                  className="w-full rounded-t-lg bg-accent/80 hover:bg-accent transition-all duration-300"
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                />
                <span className="text-xs text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Member growth chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Member Growth (12 Months)</h3>
          <div className="relative h-40">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#DC2626"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data.memberGrowth
                  .map((m, i) => `${(i / (data.memberGrowth.length - 1)) * 100},${(1 - m.count / maxMemberGrowth) * 35 + 2}`)
                  .join(" ")}
              />
              {data.memberGrowth.map((m, i) => (
                <circle
                  key={m.month}
                  cx={(i / (data.memberGrowth.length - 1)) * 100}
                  cy={(1 - m.count / maxMemberGrowth) * 35 + 2}
                  r="0.8"
                  fill="#DC2626"
                />
              ))}
            </svg>
            <div className="flex justify-between mt-2">
              {data.memberGrowth.filter((_, i) => i % 2 === 0).map((m) => (
                <span key={m.month} className="text-xs text-gray-600">{m.month}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Popular equipment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Popular Equipment</h3>
          <div className="space-y-3">
            {data.popularEquipment.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <Dumbbell className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-300 w-28">{item.name}</span>
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent/70 transition-all duration-500"
                    style={{ width: `${(item.count / maxEquipment) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Category Distribution</h3>
          <div className="flex items-center gap-6">
            <div
              className="w-32 h-32 rounded-full flex-shrink-0"
              style={{
                background: `conic-gradient(
                  #DC2626 ${data.categoryDistribution[0].percentage}%,
                  #3B82F6 ${data.categoryDistribution[0].percentage}% ${data.categoryDistribution[0].percentage + data.categoryDistribution[1].percentage}%,
                  #22C55E ${data.categoryDistribution[0].percentage + data.categoryDistribution[1].percentage}% ${data.categoryDistribution[0].percentage + data.categoryDistribution[1].percentage + data.categoryDistribution[2].percentage}%,
                  #F59E0B ${data.categoryDistribution[0].percentage + data.categoryDistribution[1].percentage + data.categoryDistribution[2].percentage}% ${data.categoryDistribution[0].percentage + data.categoryDistribution[1].percentage + data.categoryDistribution[2].percentage + data.categoryDistribution[3].percentage}%,
                  #8B5CF6 ${data.categoryDistribution[0].percentage + data.categoryDistribution[1].percentage + data.categoryDistribution[2].percentage + data.categoryDistribution[3].percentage}% 100%
                )`,
              }}
            />
            <div className="space-y-2">
              {data.categoryDistribution.map((cat, i) => {
                const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];
                return (
                  <div key={cat.category} className="flex items-center gap-2">
                    <span className={cn("w-3 h-3 rounded-full", colors[i])} />
                    <span className="text-sm text-gray-300">{cat.category}</span>
                    <span className="text-xs text-gray-500">{cat.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
