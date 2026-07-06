"use client";

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  tags: string[];
}

export interface MemberStory {
  id: string;
  title: string;
  memberName: string;
  memberAvatar: string;
  story: string;
  tags: string[];
  likes: number;
  date: string;
  beforeWeight?: number;
  afterWeight?: number;
}

export interface Transformation {
  id: string;
  name: string;
  beforeStats: string;
  afterStats: string;
  period: string;
  story: string;
  category: string;
  color1: string;
  color2: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration: string;
  goal: string;
  participants: number;
  endDate: string;
  category: string;
  joined: boolean;
  progress: number;
  icon: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  category: string;
  badge?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  howToEarn: string;
}

export interface ReferralData {
  code: string;
  reward: string;
  totalReferrals: number;
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

export function getReviews(): Review[] {
  return getData<Review[]>("gym56_reviews", seedReviews);
}

export function addReview(r: Review): Review[] {
  const list = getReviews();
  list.unshift(r);
  setData("gym56_reviews", list);
  return list;
}

export function getStories(): MemberStory[] {
  return getData<MemberStory[]>("gym56_stories", seedStories);
}

export function addStory(s: MemberStory): MemberStory[] {
  const list = getStories();
  list.unshift(s);
  setData("gym56_stories", list);
  return list;
}

export function likeStory(id: string): MemberStory[] {
  const list = getStories().map((s) =>
    s.id === id ? { ...s, likes: s.likes + 1 } : s
  );
  setData("gym56_stories", list);
  return list;
}

export function getTransformations(): Transformation[] {
  return getData<Transformation[]>("gym56_transformations", seedTransformations);
}

export function getChallenges(): Challenge[] {
  return getData<Challenge[]>("gym56_challenges", seedChallenges);
}

export function toggleChallengeJoin(id: string): Challenge[] {
  const list = getChallenges().map((c) =>
    c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c
  );
  setData("gym56_challenges", list);
  return list;
}

export function getLeaderboard(): LeaderboardEntry[] {
  return getData<LeaderboardEntry[]>("gym56_leaderboard", seedLeaderboard);
}

export function getBadges(): Badge[] {
  return getData<Badge[]>("gym56_badges", seedBadges);
}

export function getReferral(): ReferralData {
  return getData<ReferralData>("gym56_referral", seedReferral);
}

export function incrementReferral(): ReferralData {
  const ref = getReferral();
  ref.totalReferrals += 1;
  setData("gym56_referral", ref);
  return ref;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const seedReviews: Review[] = [
  { id: "r1", name: "Arun Sharma", avatar: "AS", rating: 5, text: "Best gym in town! The equipment is top-notch and the trainers are incredibly knowledgeable. Joined 3 months ago and already seeing amazing results.", date: daysAgo(2), tags: ["Equipment", "Trainers"] },
  { id: "r2", name: "Priya Patel", avatar: "PP", rating: 5, text: "The HIIT classes are incredible. Great atmosphere and the community is so supportive. Love the morning sessions!", date: daysAgo(5), tags: ["Classes", "Community"] },
  { id: "r3", name: "Rahul Verma", avatar: "RV", rating: 4, text: "Excellent facility with modern equipment. The nutrition guidance helped me plan my meals better. Would recommend!", date: daysAgo(8), tags: ["Nutrition", "Equipment"] },
  { id: "r4", name: "Sneha Gupta", avatar: "SG", rating: 5, text: "The yoga sessions are amazing! Great for flexibility and recovery. The instructors pay personal attention to everyone.", date: daysAgo(12), tags: ["Classes", "Instructors"] },
  { id: "r5", name: "Vikram Singh", avatar: "VS", rating: 4, text: "Great place for powerlifting. The equipment is well-maintained and the crowd is serious about fitness. Extended hours access is a bonus!", date: daysAgo(15), tags: ["Equipment", "Facilities"] },
  { id: "r6", name: "Ananya Reddy", avatar: "AR", rating: 5, text: "After trying 5 different gyms, this is the one that stuck. The community feeling here is unmatched. Feels like a second home!", date: daysAgo(20), tags: ["Community", "Atmosphere"] },
  { id: "r7", name: "Karan Joshi", avatar: "KJ", rating: 5, text: "Personal training sessions with Raj are game-changing. He designed a program that worked around my injury and I've never been stronger.", date: daysAgo(25), tags: ["Personal Training", "Instructors"] },
  { id: "r8", name: "Divya Nair", avatar: "DN", rating: 4, text: "Clean facilities, great steam room, and the supplement shop has everything I need. The monthly challenges keep me motivated!", date: daysAgo(30), tags: ["Facilities", "Challenges"] },
];

const seedStories: MemberStory[] = [
  { id: "s1", title: "From Couch to 5K in 8 Weeks", memberName: "Ajay Mehta", memberAvatar: "AM", story: "I had never run a kilometer in my life. The Couch to 5K program at Gym 56 changed everything. With the support of the trainers and the running group, I completed my first 5K in just 8 weeks. Now I'm training for a half marathon!", tags: ["Weight Loss", "Running"], likes: 45, date: daysAgo(3), beforeWeight: 92, afterWeight: 78 },
  { id: "s2", title: "Reversed My Diabetes Through Fitness", memberName: "Lakshmi Iyer", memberAvatar: "LI", story: "At 52, I was diagnosed with type 2 diabetes. My doctor said I needed to lose weight and get active. The team at Gym 56 created a customized plan combining strength training and cardio. Six months later, my blood sugar is normal and I'm off medication!", tags: ["Health", "Weight Loss"], likes: 78, date: daysAgo(7), beforeWeight: 85, afterWeight: 68 },
  { id: "s3", title: "Gained 15kg of Lean Muscle", memberName: "Rohit Desai", memberAvatar: "RD", story: "I was always the skinny guy. No matter how much I ate, I couldn't gain weight. The trainers at Gym 56 taught me proper nutrition and progressive overload. 8 months of consistent training and I've gained 15kg of lean muscle. Best decision ever!", tags: ["Muscle Gain", "Strength"], likes: 112, date: daysAgo(10), beforeWeight: 62, afterWeight: 77 },
  { id: "s4", title: "Post-Pregnancy Fitness Comeback", memberName: "Neha Kapoor", memberAvatar: "NK", story: "After my second child, I struggled with my body image and energy levels. The postpartum fitness program helped me regain my strength and confidence. The trainers were incredibly supportive and understanding of my limitations. Now I feel stronger than ever!", tags: ["Postpartum", "Fitness"], likes: 67, date: daysAgo(14), beforeWeight: 78, afterWeight: 63 },
  { id: "s5", title: "From 120kg to 75kg — My Transformation", memberName: "Suresh Kumar", memberAvatar: "SK", story: "Weighing 120kg was taking a toll on my health and happiness. I decided to make a change and joined Gym 56. With a combination of strength training, cardio, and nutrition counseling, I lost 45kg in 14 months. This gym literally saved my life!", tags: ["Weight Loss", "Transformation"], likes: 234, date: daysAgo(20), beforeWeight: 120, afterWeight: 75 },
  { id: "s6", title: "Competing in My First Powerlifting Meet", memberName: "Arjun Nair", memberAvatar: "AN", story: "I started lifting just to get fit, but the trainers saw potential and encouraged me to compete. 9 months of dedicated training, and I placed 2nd in my first powerlifting competition! The team at Gym 56 supported me every step of the way.", tags: ["Powerlifting", "Competition"], likes: 89, date: daysAgo(25), beforeWeight: 80, afterWeight: 85 },
];

const seedTransformations: Transformation[] = [
  { id: "t1", name: "Priya's 6-Month Journey", beforeStats: "78 kg", afterStats: "62 kg", period: "6 months", story: "Lost 16 kg through consistent training and nutrition planning", category: "Weight Loss", color1: "#DC2626", color2: "#22c55e" },
  { id: "t2", name: "Rahul's Body Recomposition", beforeStats: "25% BF", afterStats: "12% BF", period: "8 months", story: "Dropped from 25% to 12% body fat while gaining muscle", category: "Body Composition", color1: "#f59e0b", color2: "#3b82f6" },
  { id: "t3", name: "Anita's Strength Journey", beforeStats: "40kg Squat", afterStats: "100kg Squat", period: "12 months", story: "More than doubled her squat in one year of dedicated training", category: "Strength", color1: "#8b5cf6", color2: "#ec4899" },
  { id: "t4", name: "Vikram's Muscle Gain", beforeStats: "55 kg", afterStats: "72 kg", period: "10 months", story: "Gained 17 kg of lean muscle mass with proper programming", category: "Muscle Gain", color1: "#06b6d4", color2: "#DC2626" },
  { id: "t5", name: "Deepa's Marathon Prep", beforeStats: "0 km", afterStats: "42 km", period: "5 months", story: "From never running to completing a full marathon", category: "Endurance", color1: "#84cc16", color2: "#f97316" },
  { id: "t6", name: "Raj's Weight Loss", beforeStats: "105 kg", afterStats: "73 kg", period: "14 months", story: "Lost 32 kg and completely transformed his lifestyle", category: "Weight Loss", color1: "#DC2626", color2: "#eab308" },
];

const seedChallenges: Challenge[] = [
  { id: "c1", name: "30-Day Core Challenge", description: "Build a rock-solid core with daily ab workouts", duration: "30 days", goal: "Complete 30 core workouts", participants: 156, endDate: futureDate(25), category: "Strength", joined: false, progress: 0, icon: "🔥" },
  { id: "c2", name: "Summer Shred 2026", description: "Lose body fat and reveal your summer body", duration: "12 weeks", goal: "Lose 5-10% body fat", participants: 312, endDate: futureDate(60), category: "Weight Loss", joined: false, progress: 0, icon: "💪" },
  { id: "c3", name: "10,000 Steps Daily", description: "Walk 10K steps every day for a month", duration: "30 days", goal: "300,000 total steps", participants: 89, endDate: futureDate(20), category: "Cardio", joined: false, progress: 0, icon: "👟" },
  { id: "c4", name: "Push-Up Marathon", description: "Accumulate 1000 push-ups over 2 weeks", duration: "14 days", goal: "1000 push-ups", participants: 203, endDate: futureDate(10), category: "Strength", joined: false, progress: 0, icon: "⬆️" },
  { id: "c5", name: "Flexibility Focus", description: "Improve flexibility with daily stretching", duration: "21 days", goal: "21 stretching sessions", participants: 67, endDate: futureDate(28), category: "Flexibility", joined: false, progress: 0, icon: "🧘" },
  { id: "c6", name: "Hydration Hero", description: "Drink 3L of water every day for a month", duration: "30 days", goal: "90L total water intake", participants: 134, endDate: futureDate(35), category: "Nutrition", joined: false, progress: 0, icon: "💧" },
];

const seedLeaderboard: LeaderboardEntry[] = [
  { id: "l1", rank: 1, name: "Arjun Nair", avatar: "AN", points: 2840, category: "Overall", badge: "🏆" },
  { id: "l2", rank: 2, name: "Priya Sharma", avatar: "PS", points: 2710, category: "Overall", badge: "🥈" },
  { id: "l3", rank: 3, name: "Rahul Kapoor", avatar: "RK", points: 2590, category: "Overall", badge: "🥉" },
  { id: "l4", rank: 4, name: "Sneha Patel", avatar: "SP", points: 2430, category: "Overall" },
  { id: "l5", rank: 5, name: "Vikram Singh", avatar: "VS", points: 2280, category: "Overall" },
  { id: "l6", rank: 6, name: "Ananya Reddy", avatar: "AR", points: 2150, category: "Overall" },
  { id: "l7", rank: 7, name: "Rohit Desai", avatar: "RD", points: 2010, category: "Overall" },
  { id: "l8", rank: 8, name: "Neha Kapoor", avatar: "NK", points: 1890, category: "Overall" },
  { id: "l9", rank: 9, name: "Divya Nair", avatar: "DN", points: 1740, category: "Overall" },
  { id: "l10", rank: 10, name: "Karan Joshi", avatar: "KJ", points: 1620, category: "Overall" },
  { id: "l11", rank: 11, name: "Ajay Mehta", avatar: "AM", points: 1480, category: "Overall" },
  { id: "l12", rank: 12, name: "Lakshmi Iyer", avatar: "LI", points: 1350, category: "Overall" },
  { id: "l13", rank: 13, name: "Suresh Kumar", avatar: "SK", points: 1210, category: "Overall" },
  { id: "l14", rank: 14, name: "Deepa Gupta", avatar: "DG", points: 1080, category: "Overall" },
  { id: "l15", rank: 15, name: "Raj Mehta", avatar: "RM", points: 950, category: "Overall" },
  { id: "l16", rank: 16, name: "Anita Deshmukh", avatar: "AD", points: 820, category: "Overall" },
  { id: "l17", rank: 17, name: "Mohan Reddy", avatar: "MR", points: 710, category: "Overall" },
  { id: "l18", rank: 18, name: "Kavita Joshi", avatar: "KJ", points: 590, category: "Overall" },
  { id: "l19", rank: 19, name: "Ravi Kumar", avatar: "RK", points: 450, category: "Overall" },
  { id: "l20", rank: 20, name: "Sunita Verma", avatar: "SV", points: 320, category: "Overall" },
];

const seedBadges: Badge[] = [
  { id: "b1", name: "First Sweat", description: "Complete your first workout", icon: "💪", rarity: "common", howToEarn: "Log your first workout session" },
  { id: "b2", name: "Week Warrior", description: "Train 7 days in a row", icon: "🔥", rarity: "common", howToEarn: "Maintain a 7-day streak" },
  { id: "b3", name: "Iron Will", description: "Train 30 days straight", icon: "⚡", rarity: "rare", howToEarn: "Maintain a 30-day streak" },
  { id: "b4", name: "Weight Master", description: "Log 30 weight entries", icon: "⚖️", rarity: "rare", howToEarn: "Track your weight 30 times" },
  { id: "b5", name: "Centurion", description: "Complete 100 workouts", icon: "🏅", rarity: "epic", howToEarn: "Log 100 workout sessions" },
  { id: "b6", name: "Goal Crusher", description: "Complete 10 goals", icon: "🎯", rarity: "rare", howToEarn: "Achieve 10 personal goals" },
  { id: "b7", name: "Community Star", description: "Refer 5 friends", icon: "⭐", rarity: "epic", howToEarn: "Refer 5 friends to Gym 56" },
  { id: "b8", name: "Challenge Champion", description: "Win a gym challenge", icon: "🏆", rarity: "epic", howToEarn: "Finish first in any challenge" },
  { id: "b9", name: "Transformation King", description: "Share your transformation", icon: "🦋", rarity: "rare", howToEarn: "Post your before/after story" },
  { id: "b10", name: "Legend", description: "Reach level 50", icon: "👑", rarity: "legendary", howToEarn: "Earn 10,000 total points" },
  { id: "b11", name: "Early Bird", description: "Attend 50 morning sessions", icon: "🌅", rarity: "rare", howToEarn: "Check in before 7 AM 50 times" },
  { id: "b12", name: "Night Owl", description: "Attend 50 evening sessions", icon: "🌙", rarity: "rare", howToEarn: "Check in after 8 PM 50 times" },
];

const seedReferral: ReferralData = {
  code: "GYM56FIT",
  reward: "1 Month Free",
  totalReferrals: 3,
};
