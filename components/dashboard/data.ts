"use client";

export interface Workout {
  id: string;
  date: string;
  name: string;
  duration: number;
  exercises: { name: string; sets: number; reps: number; weight?: number }[];
  notes?: string;
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface Measurement {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
  calves?: number;
  shoulders?: number;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  photo: string;
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  category: "workout" | "weight" | "nutrition" | "attendance";
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  earned: boolean;
  date?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "achievement" | "reminder" | "goal" | "system";
  read: boolean;
  date: string;
}

function getData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getWeightLogs(): WeightLog[] {
  return getData<WeightLog[]>("gym56_weight_logs", []);
}

export function addWeightLog(log: WeightLog): WeightLog[] {
  const logs = getWeightLogs();
  const existing = logs.findIndex((l) => l.date === log.date);
  if (existing >= 0) logs[existing] = log;
  else logs.push(log);
  logs.sort((a, b) => a.date.localeCompare(b.date));
  setData("gym56_weight_logs", logs);
  return logs;
}

export function getWorkouts(): Workout[] {
  return getData<Workout[]>("gym56_workouts", []);
}

export function addWorkout(w: Workout): Workout[] {
  const list = getWorkouts();
  list.unshift(w);
  list.sort((a, b) => b.date.localeCompare(a.date));
  setData("gym56_workouts", list);
  return list;
}

export function getMeasurements(): Measurement[] {
  return getData<Measurement[]>("gym56_measurements", []);
}

export function addMeasurement(m: Measurement): Measurement[] {
  const list = getMeasurements();
  const existing = list.findIndex((x) => x.id === m.id);
  if (existing >= 0) list[existing] = m;
  else list.push(m);
  list.sort((a, b) => b.date.localeCompare(a.date));
  setData("gym56_measurements", list);
  return list;
}

export function getProgressPhotos(): ProgressPhoto[] {
  return getData<ProgressPhoto[]>("gym56_progress_photos", []);
}

export function addProgressPhoto(p: ProgressPhoto): ProgressPhoto[] {
  const list = getProgressPhotos();
  list.unshift(p);
  setData("gym56_progress_photos", list);
  return list;
}

export function deleteProgressPhoto(id: string): ProgressPhoto[] {
  const list = getProgressPhotos().filter((p) => p.id !== id);
  setData("gym56_progress_photos", list);
  return list;
}

export function getGoals(): Goal[] {
  return getData<Goal[]>("gym56_goals", seedGoals);
}

export function addGoal(g: Goal): Goal[] {
  const list = getGoals();
  list.push(g);
  setData("gym56_goals", list);
  return list;
}

export function updateGoal(id: string, updates: Partial<Goal>): Goal[] {
  const list = getGoals().map((g) => (g.id === id ? { ...g, ...updates } : g));
  setData("gym56_goals", list);
  return list;
}

export function deleteGoal(id: string): Goal[] {
  const list = getGoals().filter((g) => g.id !== id);
  setData("gym56_goals", list);
  return list;
}

export function getAttendance(): string[] {
  return getData<string[]>("gym56_attendance", []);
}

export function toggleAttendance(date: string): string[] {
  const list = getAttendance();
  const idx = list.indexOf(date);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(date);
  list.sort();
  setData("gym56_attendance", list);
  return list;
}

export function getAchievements(): Achievement[] {
  return getData<Achievement[]>("gym56_achievements", seedAchievements);
}

export function unlockAchievement(id: string): Achievement[] {
  const list = getAchievements().map((a) =>
    a.id === id ? { ...a, earned: true, date: new Date().toISOString().slice(0, 10) } : a
  );
  setData("gym56_achievements", list);
  return list;
}

export function getNotifications(): Notification[] {
  return getData<Notification[]>("gym56_notifications", seedNotifications);
}

export function addNotification(n: Notification): Notification[] {
  const list = getNotifications();
  list.unshift(n);
  setData("gym56_notifications", list);
  return list;
}

export function markNotificationRead(id: string): Notification[] {
  const list = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
  setData("gym56_notifications", list);
  return list;
}

export function markAllNotificationsRead(): Notification[] {
  const list = getNotifications().map((n) => ({ ...n, read: true }));
  setData("gym56_notifications", list);
  return list;
}

export function clearAllNotifications(): Notification[] {
  setData("gym56_notifications", []);
  return [];
}

export function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const sorted = [...dates].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let check = today;
  for (const d of sorted) {
    if (d === check) {
      streak++;
      const prev = new Date(check);
      prev.setDate(prev.getDate() - 1);
      check = prev.toISOString().slice(0, 10);
    } else if (d < check) break;
  }
  return streak;
}

export function computeAchievements(): Achievement[] {
  const achievements = getAchievements();
  const workouts = getWorkouts();
  const weightLogs = getWeightLogs();
  const attendance = getAttendance();
  const streak = computeStreak(attendance);
  const goals = getGoals();
  const changed: string[] = [];

  if (workouts.length >= 1 && !achievements.find((a) => a.id === "first_workout")?.earned) {
    achievements.find((a) => a.id === "first_workout")!.earned = true;
    achievements.find((a) => a.id === "first_workout")!.date = new Date().toISOString().slice(0, 10);
    changed.push("first_workout");
  }
  if (workouts.length >= 5) {
    const a = achievements.find((a) => a.id === "5_workouts");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("5_workouts"); }
  }
  if (workouts.length >= 15) {
    const a = achievements.find((a) => a.id === "15_workouts");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("15_workouts"); }
  }
  if (streak >= 3) {
    const a = achievements.find((a) => a.id === "3_day_streak");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("3_day_streak"); }
  }
  if (streak >= 7) {
    const a = achievements.find((a) => a.id === "7_day_streak");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("7_day_streak"); }
  }
  if (streak >= 30) {
    const a = achievements.find((a) => a.id === "30_day_streak");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("30_day_streak"); }
  }
  if (weightLogs.length >= 1) {
    const a = achievements.find((a) => a.id === "weight_logged");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("weight_logged"); }
  }
  if (weightLogs.length >= 7) {
    const a = achievements.find((a) => a.id === "7_weight_logs");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("7_weight_logs"); }
  }
  if (goals.filter((g) => g.completed).length >= 1) {
    const a = achievements.find((a) => a.id === "first_goal");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("first_goal"); }
  }
  if (goals.filter((g) => g.completed).length >= 3) {
    const a = achievements.find((a) => a.id === "3_goals");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("3_goals"); }
  }
  if (attendance.length >= 7) {
    const a = achievements.find((a) => a.id === "7_days");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("7_days"); }
  }
  if (attendance.length >= 30) {
    const a = achievements.find((a) => a.id === "30_days");
    if (a && !a.earned) { a.earned = true; a.date = new Date().toISOString().slice(0, 10); changed.push("30_days"); }
  }

  setData("gym56_achievements", achievements);
  return achievements;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const seedAchievements: Achievement[] = [
  { id: "first_workout", name: "First Sweat", description: "Log your first workout", icon: "💪", condition: "workouts >= 1", earned: false },
  { id: "5_workouts", name: "Getting Started", description: "Complete 5 workouts", icon: "🔥", condition: "workouts >= 5", earned: false },
  { id: "15_workouts", name: "Dedicated", description: "Complete 15 workouts", icon: "⭐", condition: "workouts >= 15", earned: false },
  { id: "3_day_streak", name: "3-Day Streak", description: "Train 3 days in a row", icon: "📅", condition: "streak >= 3", earned: false },
  { id: "7_day_streak", name: "Week Warrior", description: "Train 7 days in a row", icon: "🏆", condition: "streak >= 7", earned: false },
  { id: "30_day_streak", name: "Iron Will", description: "Train 30 days in a row", icon: "⚡", condition: "streak >= 30", earned: false },
  { id: "weight_logged", name: "On the Scale", description: "Log your first weight", icon: "⚖️", condition: "weight_logs >= 1", earned: false },
  { id: "7_weight_logs", name: "Consistent Tracker", description: "Log weight 7 times", icon: "📊", condition: "weight_logs >= 7", earned: false },
  { id: "first_goal", name: "Goal Getter", description: "Complete your first goal", icon: "🎯", condition: "goals >= 1", earned: false },
  { id: "3_goals", name: "Achiever", description: "Complete 3 goals", icon: "🏅", condition: "goals >= 3", earned: false },
  { id: "7_days", name: "First Week", description: "Attend gym for 7 days total", icon: "📆", condition: "attendance >= 7", earned: false },
  { id: "30_days", name: "One Month Strong", description: "Attend gym for 30 days", icon: "🎖️", condition: "attendance >= 30", earned: false },
];

const seedGoals: Goal[] = [
  { id: "g1", title: "Workout 4x per week", target: 4, current: 3, unit: "sessions", deadline: "", category: "workout", completed: false },
  { id: "g2", title: "Reach target weight", target: 80, current: 83, unit: "kg", deadline: daysAgo(-30), category: "weight", completed: false },
  { id: "g3", title: "Drink 2L water daily", target: 7, current: 5, unit: "days", deadline: "", category: "nutrition", completed: false },
  { id: "g4", title: "Attend gym 5 days/week", target: 5, current: 5, unit: "days", deadline: daysAgo(-7), category: "attendance", completed: true },
];

const seedNotifications: Notification[] = [
  { id: "n1", title: "Welcome to Dashboard", message: "Track your fitness journey with Gym 56", type: "system", read: false, date: daysAgo(0) },
  { id: "n2", title: "Goal Update", message: "You completed 'Attend gym 5 days/week'!", type: "goal", read: false, date: daysAgo(1) },
  { id: "n3", title: "Streak Reminder", message: "Keep your streak alive! Visit the gym today.", type: "reminder", read: false, date: daysAgo(2) },
  { id: "n4", title: "New Achievement", message: "Unlocked: Goal Getter!", type: "achievement", read: true, date: daysAgo(3) },
];
