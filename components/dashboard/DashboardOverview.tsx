"use client";

import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell, Flame, Calendar, Scale, Ruler, Trophy, Target,
  Bell, ChevronRight, Plus, X, Check, Camera, Clock,
  TrendingDown, TrendingUp,
  BarChart3, Activity,
  Trash2, CheckCircle, Circle,
  Loader2, LogIn,
  Sparkles, ChevronLeft
} from "lucide-react";
import {
  getWeightLogs, addWeightLog,
  getWorkouts, addWorkout,
  getMeasurements, addMeasurement,
  getProgressPhotos, addProgressPhoto, deleteProgressPhoto,
  getGoals, addGoal, updateGoal, deleteGoal,
  getAttendance, toggleAttendance,
  computeAchievements,
  getNotifications, markNotificationRead,
  markAllNotificationsRead, clearAllNotifications,
  computeStreak,
  type Workout, type WeightLog, type Measurement,
  type ProgressPhoto, type Goal, type Achievement,
  type Notification as NotifType
} from "./data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

interface Props {
  user: { id: string; email?: string };
  profile: { full_name?: string; avatar_url?: string; phone?: string; created_at?: string } | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 border border-white/5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[#DC2626]">{icon}</span>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
  );
}

// ─── Weight Chart SVG ──────────────────────────────────────────────────────────
function WeightChartSVG({ logs, goalWeight }: { logs: WeightLog[]; goalWeight?: number }) {
  if (!logs.length) return <p className="text-gray-500 text-sm text-center py-8">No weight data yet</p>;

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const values = sorted.map((l) => l.weight);
  const min = Math.min(...values, goalWeight ?? Infinity) - 1;
  const max = Math.max(...values, goalWeight ?? -Infinity) + 1;
  const range = max - min || 1;
  const w = 600, h = 200, px = 40, py = 20;

  const points = sorted.map((l, i) => {
    const x = px + (i / Math.max(sorted.length - 1, 1)) * (w - px * 2);
    const y = h - py - ((l.weight - min) / range) * (h - py * 2);
    return `${x},${y}`;
  });

  const goalY = goalWeight ? h - py - ((goalWeight - min) / range) * (h - py * 2) : undefined;

  const labels = sorted.filter((_, i) => i === 0 || i === sorted.length - 1 || i % Math.max(Math.floor(sorted.length / 4), 1) === 0);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" aria-label="Weight trend chart">
      <defs>
        <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={px} y1={h - py - f * (h - py * 2)} x2={w - px} y2={h - py - f * (h - py * 2)} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
      ))}
      {points.length > 1 && (
        <polygon points={[points.join(" "), `${w - px},${h - py}`, `${px},${h - py}`].join(" ")} fill="url(#weightGrad)" />
      )}
      <polyline points={points.join(" ")} fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={+p.split(",")[0]} cy={+p.split(",")[1]} r="3" fill="#DC2626" className="hover:r-5 transition-all" />
      ))}
      {goalY !== undefined && (
        <line x1={px} y1={goalY} x2={w - px} y2={goalY} stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6 3" opacity={0.6} />
      )}
      {labels.map((l) => {
        const i = sorted.indexOf(l);
        const x = px + (i / Math.max(sorted.length - 1, 1)) * (w - px * 2);
        return <text key={l.date} x={x} y={h - 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10">{new Date(l.date).getDate()}/{new Date(l.date).getMonth() + 1}</text>;
      })}
      <text x={px - 8} y={py + 10} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="10">{Math.round(max)}</text>
      <text x={px - 8} y={h - py} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="10">{Math.round(min)}</text>
      {goalY !== undefined && <text x={w - px - 4} y={goalY - 4} textAnchor="end" fill="#22c55e" fontSize="10">Goal</text>}
    </svg>
  );
}

// ─── Weekly Calendar SVG ───────────────────────────────────────────────────────
function WeeklyCalendar({ attendance, onToggle }: { attendance: string[]; onToggle: (d: string) => void }) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex gap-1.5 justify-center">
      {days.map((d, i) => {
        const dateStr = d.toISOString().slice(0, 10);
        const isToday = dateStr === today.toISOString().slice(0, 10);
        const isCheckedIn = attendance.includes(dateStr);
        return (
          <button
            key={dateStr}
            onClick={() => onToggle(dateStr)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[44px] ${
              isCheckedIn
                ? "bg-[#DC2626]/20 border border-[#DC2626]/40"
                : "bg-white/5 border border-white/10 hover:bg-white/10"
            } ${isToday ? "ring-2 ring-[#DC2626]/60" : ""}`}
            aria-label={`${dayNames[i]} ${d.getDate()}${isCheckedIn ? ", checked in" : ""}`}
          >
            <span className="text-xs text-gray-500">{dayNames[i]}</span>
            <span className={`text-sm font-bold ${isToday ? "text-white" : "text-gray-400"}`}>{d.getDate()}</span>
            {isCheckedIn && <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Monthly Calendar ──────────────────────────────────────────────────────────
function MonthlyCalendar({ attendance }: { attendance: string[] }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/10 text-gray-400" aria-label="Previous month"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-sm font-semibold text-white">{monthName} {year}</span>
        <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/10 text-gray-400" aria-label="Next month"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-xs text-gray-600 py-1">{d}</div>
        ))}
        {days.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isToday = dateStr === today.toISOString().slice(0, 10);
          const isChecked = attendance.includes(dateStr);
          return (
            <div
              key={dateStr}
              className={`text-center py-1.5 rounded-lg text-sm ${
                isChecked ? "bg-[#DC2626]/20 text-[#DC2626] font-bold" : isToday ? "bg-white/10 text-white font-bold" : "text-gray-500"
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mini Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#DC2626", width = 60, height = 24 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = "#DC2626" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full" style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ================================================================
// MAIN COMPONENT
// ================================================================
export default function DashboardOverview({ user, profile }: Props) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Data states
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [attendance, setAttendance] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<NotifType[]>([]);

  // UI states
  const [activeTab, setActiveTab] = useState<"overview" | "workouts" | "progress" | "goals">("overview");
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data on mount
  useEffect(() => {
    setMounted(true);
    setWeightLogs(getWeightLogs());
    setWorkouts(getWorkouts());
    setMeasurements(getMeasurements());
    setProgressPhotos(getProgressPhotos());
    setGoals(getGoals());
    setAttendance(getAttendance());
    setAchievements(computeAchievements());
    setNotifications(getNotifications());
  }, []);

  // Derived data
  const streak = useMemo(() => computeStreak(attendance), [attendance]);
  const workoutsThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workouts.filter((w) => new Date(w.date) >= weekAgo).length;
  }, [workouts]);
  const completedGoals = useMemo(() => goals.filter((g) => g.completed).length, [goals]);
  const unreadNotifs = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const weightChange = useMemo(() => {
    if (weightLogs.length < 2) return null;
    const sorted = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
    return sorted[sorted.length - 1].weight - sorted[0].weight;
  }, [weightLogs]);

  const attendanceRate = useMemo(() => {
    const total = attendance.length;
    const period = 30;
    return total > 0 ? Math.min(Math.round((total / period) * 100), 100) : 0;
  }, [attendance]);

  const earnedAchievements = useMemo(() => achievements.filter((a) => a.earned).length, [achievements]);
  const measurementCount = measurements.length;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleAddWeight = () => {
    const w = parseFloat(newWeight);
    if (isNaN(w) || w <= 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const updated = addWeightLog({ date: today, weight: w });
    setWeightLogs(updated);
    setNewWeight("");
    setShowAddWeight(false);
    setAchievements(computeAchievements());
    toast({ title: "Weight logged!", variant: "success" });
  };

  const handleAddWorkout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const duration = parseInt(data.get("duration") as string) || 30;
    if (!name.trim()) return;
    const workout: Workout = {
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      name,
      duration,
      exercises: [],
    };
    const updated = addWorkout(workout);
    setWorkouts(updated);
    const att = toggleAttendance(new Date().toISOString().slice(0, 10));
    setAttendance(att);
    setShowAddWorkout(false);
    setAchievements(computeAchievements());
    toast({ title: "Workout logged!", description: `${name} - ${duration} min`, variant: "success" });
  };

  const handleToggleAttendance = (date: string) => {
    const updated = toggleAttendance(date);
    setAttendance(updated);
    setAchievements(computeAchievements());
  };

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = data.get("title") as string;
    const target = parseFloat(data.get("target") as string) || 1;
    const unit = (data.get("unit") as string) || "sessions";
    if (!title.trim()) return;
    const goal: Goal = {
      id: Math.random().toString(36).slice(2),
      title,
      target,
      current: 0,
      unit,
      category: "workout",
      completed: false,
    };
    const updated = addGoal(goal);
    setGoals(updated);
    setShowAddGoal(false);
    toast({ title: "Goal added!", variant: "success" });
  };

  const handleCompleteGoal = (id: string) => {
    const updated = updateGoal(id, { completed: true, current: goals.find((g) => g.id === id)?.target ?? 0 });
    setGoals(updated);
    setAchievements(computeAchievements());
    toast({ title: "Goal completed! 🎯", variant: "success" });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(deleteGoal(id));
  };

  const handleAddMeasurement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const m: Measurement = {
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      chest: parseFloat(data.get("chest") as string) || undefined,
      waist: parseFloat(data.get("waist") as string) || undefined,
      arms: parseFloat(data.get("arms") as string) || undefined,
      thighs: parseFloat(data.get("thighs") as string) || undefined,
      calves: parseFloat(data.get("calves") as string) || undefined,
      shoulders: parseFloat(data.get("shoulders") as string) || undefined,
    };
    const updated = addMeasurement(m);
    setMeasurements(updated);
    setShowAddMeasurement(false);
    toast({ title: "Measurements saved!", variant: "success" });
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      const photo: ProgressPhoto = {
        id: Math.random().toString(36).slice(2),
        date: new Date().toISOString(),
        photo: url,
      };
      const updated = addProgressPhoto(photo);
      setProgressPhotos(updated);
      toast({ title: "Progress photo added!", variant: "success" });
    };
    reader.readAsDataURL(file);
  };

  const monthAttendance = useMemo(() => {
    const m = new Date().getMonth();
    const y = new Date().getFullYear();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (attendance.includes(dateStr)) count++;
    }
    return count;
  }, [attendance]);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin" />
      </div>
    );
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "Today";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* ═══ Mobile Tab Nav ═══ */}
      <div className="flex lg:hidden gap-1 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        {[
          { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
          { id: "workouts", label: "Workouts", icon: <Dumbbell className="w-4 h-4" /> },
          { id: "progress", label: "Progress", icon: <TrendingUp className="w-4 h-4" /> },
          { id: "goals", label: "Goals", icon: <Target className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? "bg-[#DC2626] text-white" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
            aria-label={`Tab: ${tab.label}`}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ Welcome Header ═══ */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Welcome back,{" "}
            <span className="text-[#DC2626]">{profile?.full_name || user.email?.split("@")[0] || "Member"}</span>
          </h1>
          <p className="text-gray-400 mt-1">Your fitness journey at Gym 56</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-xl font-black text-white">{streak}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Day Streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2.5">
            <Calendar className="w-5 h-5 text-[#DC2626]" />
            <div>
              <p className="text-lg font-bold text-white">{memberSince}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Member Since</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ Notification Bar ═══ */}
      {unreadNotifs > 0 && (
        <motion.div variants={itemVariants} className="glass rounded-2xl p-4 border-l-4 border-l-[#DC2626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#DC2626]" />
            <p className="text-sm text-gray-300">
              You have <span className="text-white font-semibold">{unreadNotifs}</span> unread notification{unreadNotifs > 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => { setNotifications(markAllNotificationsRead()); }} className="text-xs text-[#DC2626] hover:text-white transition-colors font-semibold" aria-label="Mark all notifications as read">
            Mark all read
          </button>
        </motion.div>
      )}

      {/* ═══ Stats Row ═══ */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {[
          { icon: <Dumbbell className="w-4 h-4" />, label: "Workouts", value: `${workoutsThisWeek}`, sub: "this week", color: "text-blue-400" },
          { icon: <Flame className="w-4 h-4" />, label: "Streak", value: `${streak}d`, sub: "current", color: "text-orange-400" },
          { icon: <LogIn className="w-4 h-4" />, label: "Attendance", value: `${attendanceRate}%`, sub: `${attendance.length} days`, color: "text-green-400" },
          { icon: weightChange !== null && weightChange < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />, label: "Weight", value: weightChange !== null ? `${Math.abs(weightChange).toFixed(1)}kg` : "—", sub: weightChange !== null ? (weightChange < 0 ? "lost" : "gained") : "no data", color: weightChange !== null && weightChange < 0 ? "text-green-400" : "text-yellow-400" },
          { icon: <Ruler className="w-4 h-4" />, label: "Measure", value: `${measurementCount}`, sub: "logged", color: "text-purple-400" },
          { icon: <Trophy className="w-4 h-4" />, label: "Achievements", value: `${earnedAchievements}/${achievements.length}`, sub: "unlocked", color: "text-yellow-400" },
          { icon: <Target className="w-4 h-4" />, label: "Goals", value: `${completedGoals}/${goals.length}`, sub: "done", color: "text-emerald-400" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-3 sm:p-4 border border-white/5">
            <div className={`${stat.color} mb-1`}>{stat.icon}</div>
            <p className="text-lg sm:text-xl font-black text-white" role="status">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-gray-600">{stat.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* DESKTOP: Show all sections */}
      {/* MOBILE: Show only active tab */}
      {/* ══════════════════════════════════════════════════════════════════════ */}

      {/* ─── Section: Membership + Weight ─── */}
      {(activeTab === "overview" || true) &&
        <div className={`${activeTab !== "overview" ? "hidden lg:grid" : "grid"} grid-cols-1 lg:grid-cols-2 gap-6`}>
          {/* Quick Stats Card */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <SectionTitle icon={<Activity className="w-5 h-5" />} title="Quick Stats" />
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <Dumbbell className="w-6 h-6 text-[#DC2626] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{workouts.length}</p>
                  <p className="text-xs text-gray-500">Workouts</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <Flame className="w-6 h-6 text-[#DC2626] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{streak}</p>
                  <p className="text-xs text-gray-500">Day Streak</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <Scale className="w-6 h-6 text-[#DC2626] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{weightLogs.length > 0 ? `${weightLogs[weightLogs.length - 1].weight}kg` : "—"}</p>
                  <p className="text-xs text-gray-500">Current Weight</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <Trophy className="w-6 h-6 text-[#DC2626] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{achievements.filter(a => a.earned).length}</p>
                  <p className="text-xs text-gray-500">Achievements</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Weight Tracker */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle icon={<Scale className="w-5 h-5" />} title="Weight Tracker" />
                <button onClick={() => setShowAddWeight(!showAddWeight)} className="text-xs text-[#DC2626] hover:text-white transition-colors font-semibold flex items-center gap-1" aria-label="Log weight">
                  <Plus className="w-3.5 h-3.5" /> Log Weight
                </button>
              </div>
              {showAddWeight && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex gap-2 mb-4">
                  <Input type="number" step="0.1" placeholder="Weight (kg)" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="flex-1" />
                  <Button size="sm" onClick={handleAddWeight}><Check className="w-4 h-4" /></Button>
                </motion.div>
              )}
              <WeightChartSVG logs={weightLogs} goalWeight={goals.find((g) => g.category === "weight")?.target} />
              {weightLogs.length > 0 && (
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>Latest: {weightLogs[weightLogs.length - 1].weight} kg</span>
                  <span className="text-[#DC2626]">{weightLogs.length} entries</span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      }

      {/* ─── Section: Calendar + Recent Workouts ─── */}
      {(activeTab === "overview" || activeTab === "workouts") &&
        <div className={`${activeTab !== "workouts" ? "hidden lg:grid" : "grid"} grid-cols-1 lg:grid-cols-2 gap-6`}>
          {/* Workout Calendar */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <SectionTitle icon={<Calendar className="w-5 h-5" />} title="This Week" />
              <WeeklyCalendar attendance={attendance} onToggle={handleToggleAttendance} />
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Tap a day to check in</span>
                <span className="text-green-400">{monthAttendance} check-ins this month</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Workouts */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle icon={<Dumbbell className="w-5 h-5" />} title="Recent Workouts" />
                <button onClick={() => setShowAddWorkout(true)} className="text-xs text-[#DC2626] hover:text-white transition-colors font-semibold flex items-center gap-1" aria-label="Log workout">
                  <Plus className="w-3.5 h-3.5" /> Log Workout
                </button>
              </div>
              <AnimatePresence>
                {showAddWorkout && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddWorkout} className="mb-4 space-y-2 overflow-hidden">
                    <Input name="name" placeholder="Workout name (e.g. Push Day)" required />
                    <div className="flex gap-2">
                      <Input name="duration" type="number" placeholder="Duration (min)" className="flex-1" />
                      <Button type="submit" size="sm"><Plus className="w-4 h-4" /></Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
              {workouts.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No workouts logged yet</p>
                  <button onClick={() => setShowAddWorkout(true)} className="text-[#DC2626] text-xs font-semibold mt-2 hover:text-white" aria-label="Log your first workout">Log your first workout</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin">
                  {workouts.slice(0, 10).map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#DC2626]/10 flex items-center justify-center">
                          <Dumbbell className="w-4 h-4 text-[#DC2626]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{w.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{w.duration} min</span>
                            <span>•</span>
                            <span>{new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                          </div>
                        </div>
                      </div>
                      <Sparkline data={[60, 65, 70, 68, 75, 72, 80]} />
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      }

      {/* ─── Section: Achievements ─── */}
      {(activeTab === "overview" || activeTab === "goals") &&
        <motion.div variants={itemVariants} className={`${activeTab !== "goals" ? "hidden lg:block" : ""}`}>
          <GlassCard>
            <SectionTitle icon={<Trophy className="w-5 h-5" />} title={`Achievements (${earnedAchievements}/${achievements.length})`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {achievements.map((a) => (
                <motion.div
                  key={a.id}
                  whileHover={{ scale: 1.05 }}
                  className={`relative p-3 rounded-xl text-center transition-all ${
                    a.earned ? "bg-[#DC2626]/10 border border-[#DC2626]/30" : "bg-white/3 border border-white/5 opacity-40"
                  }`}
                >
                  <span className="text-2xl block mb-1">{a.icon}</span>
                  <p className={`text-xs font-semibold ${a.earned ? "text-white" : "text-gray-500"}`}>{a.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{a.description}</p>
                  {a.earned && a.date && <p className="text-[9px] text-[#DC2626] mt-1">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>}
                  {a.earned && <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#DC2626] rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      }

      {/* ─── Section: Goals + Notifications ─── */}
      {(activeTab === "overview" || activeTab === "goals") &&
        <div className={`${activeTab !== "goals" ? "hidden lg:grid" : "grid"} grid-cols-1 lg:grid-cols-2 gap-6`}>
          {/* Goals */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle icon={<Target className="w-5 h-5" />} title="Goals" />
                <button onClick={() => setShowAddGoal(true)} className="text-xs text-[#DC2626] hover:text-white transition-colors font-semibold flex items-center gap-1" aria-label="Add goal">
                  <Plus className="w-3.5 h-3.5" /> Add Goal
                </button>
              </div>
              <AnimatePresence>
                {showAddGoal && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddGoal} className="mb-4 space-y-2 overflow-hidden">
                    <Input name="title" placeholder="Goal title" required />
                    <div className="flex gap-2">
                      <Input name="target" type="number" placeholder="Target" className="flex-1" />
                      <Input name="unit" placeholder="Unit (e.g. kg, sessions)" className="flex-1" />
                    </div>
                    <Button type="submit" size="sm" aria-label="Add goal"><Plus className="w-4 h-4" /> Add</Button>
                  </motion.form>
                )}
              </AnimatePresence>
              <div className="space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin">
                {goals.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No goals set yet</p>
                  </div>
                ) : (
                  goals.map((g) => {
                    return (
                      <div key={g.id} className={`p-3 rounded-xl border transition-all ${g.completed ? "bg-green-500/5 border-green-500/20" : "bg-white/3 border-white/5"}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <button onClick={() => !g.completed && handleCompleteGoal(g.id)} className="flex-shrink-0" aria-label={g.completed ? `Goal "${g.title}" completed` : `Mark goal "${g.title}" as complete`}>
                                {g.completed ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Circle className="w-4 h-4 text-gray-500 hover:text-[#DC2626]" />}
                              </button>
                              <p className={`text-sm font-semibold truncate ${g.completed ? "text-gray-400 line-through" : "text-white"}`}>{g.title}</p>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <ProgressBar value={g.current} max={g.target} color={g.completed ? "#22c55e" : "#DC2626"} />
                              <span className="text-xs text-gray-500 flex-shrink-0">{g.current}/{g.target} {g.unit}</span>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteGoal(g.id)} className="text-gray-600 hover:text-red-400 ml-2 flex-shrink-0" aria-label={`Delete goal "${g.title}"`}><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle icon={<Bell className="w-5 h-5" />} title="Notifications" />
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications(clearAllNotifications())} className="text-xs text-gray-500 hover:text-white transition-colors" aria-label="Clear all notifications">
                    Clear all
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>All caught up!</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => { if (!n.read) setNotifications(markNotificationRead(n.id)); }}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        n.read ? "bg-white/3 border border-white/5" : "bg-[#DC2626]/5 border border-[#DC2626]/20"
                      }`}
                    >
                      <span className={`flex-shrink-0 mt-0.5 ${n.type === "achievement" ? "text-yellow-400" : n.type === "goal" ? "text-green-400" : n.type === "reminder" ? "text-blue-400" : "text-gray-400"}`}>
                        {n.type === "achievement" ? <Trophy className="w-4 h-4" /> : n.type === "goal" ? <Target className="w-4 h-4" /> : n.type === "reminder" ? <Bell className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${n.read ? "text-gray-400" : "text-white font-semibold"}`}>{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-gray-600 mt-1">{new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#DC2626] flex-shrink-0 mt-1.5" />}
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      }

      {/* ─── Section: Progress Photos ─── */}
      {(activeTab === "overview" || activeTab === "progress") &&
        <motion.div variants={itemVariants} className={`${activeTab !== "progress" ? "hidden lg:block" : ""}`}>
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={<Camera className="w-5 h-5" />} title="Progress Photos" />
              <button onClick={() => fileInputRef.current?.click()} className="text-xs text-[#DC2626] hover:text-white transition-colors font-semibold flex items-center gap-1" aria-label="Add progress photo">
                <Plus className="w-3.5 h-3.5" /> Add Photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoCapture} />
            </div>
            {progressPhotos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Camera className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No progress photos yet</p>
                <button onClick={() => fileInputRef.current?.click()} className="text-[#DC2626] text-xs font-semibold mt-2 hover:text-white" aria-label="Upload your first progress photo">Upload your first photo</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {progressPhotos.slice(0, 10).map((p) => (
                  <div key={p.id} className="relative group rounded-xl overflow-hidden aspect-square bg-white/5">
                    <Image src={p.photo} alt="Progress photo" width={400} height={400} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => { setProgressPhotos(deleteProgressPhoto(p.id)); }} className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-500" aria-label="Delete progress photo"><Trash2 className="w-3.5 h-3.5 text-white" /></button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-[10px] text-white font-medium">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      }

      {/* ─── Section: Body Measurements + Attendance Calendar ─── */}
      {(activeTab === "overview" || activeTab === "progress") &&
        <div className={`${activeTab !== "progress" ? "hidden lg:grid" : "grid"} grid-cols-1 lg:grid-cols-2 gap-6`}>
          {/* Body Measurements */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle icon={<Ruler className="w-5 h-5" />} title="Body Measurements" />
                <button onClick={() => setShowAddMeasurement(!showAddMeasurement)} className="text-xs text-[#DC2626] hover:text-white transition-colors font-semibold flex items-center gap-1" aria-label="Log measurements">
                  <Plus className="w-3.5 h-3.5" /> Log
                </button>
              </div>
              <AnimatePresence>
                {showAddMeasurement && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddMeasurement} className="mb-4 space-y-2 overflow-hidden">
                    <div className="grid grid-cols-2 gap-2">
                      <Input name="chest" type="number" step="0.1" placeholder="Chest (cm)" />
                      <Input name="waist" type="number" step="0.1" placeholder="Waist (cm)" />
                      <Input name="arms" type="number" step="0.1" placeholder="Arms (cm)" />
                      <Input name="thighs" type="number" step="0.1" placeholder="Thighs (cm)" />
                      <Input name="calves" type="number" step="0.1" placeholder="Calves (cm)" />
                      <Input name="shoulders" type="number" step="0.1" placeholder="Shoulders (cm)" />
                    </div>
                    <Button type="submit" size="sm" aria-label="Save measurements"><Check className="w-4 h-4" /> Save</Button>
                  </motion.form>
                )}
              </AnimatePresence>
              {measurements.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  <Ruler className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No measurements logged</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500 border-b border-white/5">
                        <th className="text-left py-2 pr-2">Date</th>
                        <th className="text-right px-1">Chest</th>
                        <th className="text-right px-1">Waist</th>
                        <th className="text-right px-1">Arms</th>
                        <th className="text-right px-1">Thighs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.slice(0, 5).map((m) => (
                        <tr key={m.id} className="border-b border-white/5">
                          <td className="py-2 pr-2 text-white text-xs">{new Date(m.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                          <td className="text-right px-1 text-gray-400 text-xs">{m.chest ? `${m.chest}` : "—"}</td>
                          <td className="text-right px-1 text-gray-400 text-xs">{m.waist ? `${m.waist}` : "—"}</td>
                          <td className="text-right px-1 text-gray-400 text-xs">{m.arms ? `${m.arms}` : "—"}</td>
                          <td className="text-right px-1 text-gray-400 text-xs">{m.thighs ? `${m.thighs}` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Attendance Calendar */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <SectionTitle icon={<Calendar className="w-5 h-5" />} title="Attendance Calendar" />
              <MonthlyCalendar attendance={attendance} />
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Total: {attendance.length} days</span>
                <span className="text-[#DC2626]">{monthAttendance} this month</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      }

      {/* ─── Quick Tips Section ─── */}
      <motion.div variants={itemVariants}>
        <GlassCard className="bg-gradient-to-r from-[#DC2626]/5 to-transparent border-[#DC2626]/20">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-[#DC2626] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Quick Tips</h3>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Log your workouts daily to maintain your {streak > 0 ? `${streak}-day` : ""} streak</li>
                <li>• Track your weight weekly to see progress trends</li>
                <li>• Take progress photos monthly to visualize changes</li>
                <li>• Set SMART goals and review them regularly</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
