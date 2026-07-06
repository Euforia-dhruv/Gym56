"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Share2, Trophy, Users, Zap,
  Copy, Check, MessageSquare,
  ChevronRight, Plus, Calendar, Flame,
  Heart, Sparkles, Gift, Send, UserPlus,
  Award, BarChart3,
  Quote, TrendingUp, Activity,
} from "lucide-react";
import {
  getReviews, addReview,
  getStories, addStory, likeStory,
  getTransformations,
  getChallenges, toggleChallengeJoin,
  getLeaderboard,
  getBadges,
  getReferral, incrementReferral,
  type Review, type MemberStory, type Transformation,
  type Challenge, type LeaderboardEntry, type Badge,
  type ReferralData,
} from "./data";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
const cardHover = { whileHover: { y: -4, transition: { duration: 0.2 } } };

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-5 sm:p-6 border border-white/5 ${className}`}>
      {children}
    </div>
  );
}

function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    common: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    rare: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    epic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    legendary: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${colors[rarity] || colors.common}`}>
      {rarity}
    </span>
  );
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
        />
      ))}
    </div>
  );
}

function Avatar({ avatar, size = "md" }: { avatar: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-[#DC2626] to-red-800 flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {avatar}
    </div>
  );
}

function SectionTitle({ icon, title, children }: { icon: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <span className="text-[#DC2626]">{icon}</span>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast({ title: "Link copied!", variant: "success" });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast({ title: "Failed to copy", variant: "error" });
      }
    }
  };

  return (
    <button onClick={handleShare} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all" title="Share">
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
    </button>
  );
}

// ─── Review Card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div variants={itemVariants} {...cardHover} className="glass rounded-2xl p-5 border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar avatar={review.avatar} size="md" />
          <div>
            <p className="text-sm font-bold text-white">{review.name}</p>
            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
        </div>
        <ShareButton url={`${typeof window !== "undefined" ? window.location.origin : ""}/community`} title={`Review by ${review.name}`} />
      </div>
      <StarRating rating={review.rating} />
      <p className="text-sm text-gray-300 mt-3 flex-1 leading-relaxed">{review.text}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {review.tags.map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20">{t}</span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Story Card ────────────────────────────────────────────────────────────────
function StoryCard({ story, onLike }: { story: MemberStory; onLike: (id: string) => void }) {
  return (
    <motion.div variants={itemVariants} {...cardHover} className="glass rounded-2xl p-5 sm:p-6 border border-white/5">
      <div className="flex items-center gap-3 mb-4">
        <Avatar avatar={story.memberAvatar} size="lg" />
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{story.memberName}</p>
          <p className="text-xs text-gray-500">{new Date(story.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <Quote className="w-8 h-8 text-[#DC2626]/20" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{story.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-4">{story.story}</p>
      {story.beforeWeight && story.afterWeight && (
        <div className="flex gap-4 mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500">Before</p>
            <p className="text-lg font-bold text-gray-400">{story.beforeWeight} kg</p>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500">After</p>
            <p className="text-lg font-bold text-green-400">{story.afterWeight} kg</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500">Lost</p>
            <p className="text-lg font-bold text-[#DC2626]">{story.beforeWeight - story.afterWeight} kg</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {story.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">{t}</span>
          ))}
        </div>
        <button onClick={() => onLike(story.id)} className="flex items-center gap-1 text-gray-500 hover:text-[#DC2626] transition-colors text-xs">
          <Heart className="w-3.5 h-3.5" />
          <span>{story.likes}</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Transformation Card ───────────────────────────────────────────────────────
function TransformationCard({ t }: { t: Transformation }) {
  return (
    <motion.div variants={itemVariants} {...cardHover} className="glass rounded-2xl overflow-hidden border border-white/5">
      <div className="flex h-48 sm:h-56">
        <div className="flex-1 relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.color1}44, ${t.color1}22)` }}>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Before</p>
            <p className="text-2xl font-black text-white">{t.beforeStats}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl">{t.category === "Weight Loss" ? "🍂" : t.category === "Strength" ? "🏋️" : t.category === "Muscle Gain" ? "💪" : "🏃"}</span>
            </div>
          </div>
        </div>
        <div className="w-8 flex items-center justify-center bg-gradient-to-b from-[#DC2626] to-red-700">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.color2}44, ${t.color2}22)` }}>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">After</p>
            <p className="text-2xl font-black text-green-400">{t.afterStats}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl">{t.category === "Weight Loss" ? "🌱" : t.category === "Strength" ? "💪" : t.category === "Muscle Gain" ? "🦾" : "🏆"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">{t.name}</h3>
          <span className="text-xs text-gray-500">{t.period}</span>
        </div>
        <p className="text-xs text-gray-400">{t.story}</p>
        <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-[#DC2626]/10 text-[#DC2626]">{t.category}</span>
      </div>
    </motion.div>
  );
}

// ─── Challenge Card ────────────────────────────────────────────────────────────
function ChallengeCard({ challenge, onJoin }: { challenge: Challenge; onJoin: (id: string) => void }) {
  return (
    <motion.div variants={itemVariants} {...cardHover} className={`glass rounded-2xl p-5 border transition-all ${
      challenge.joined ? "border-[#DC2626]/40 bg-[#DC2626]/5" : "border-white/5"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center text-xl">
            {challenge.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{challenge.name}</h3>
            <p className="text-xs text-gray-500">{challenge.duration}</p>
          </div>
        </div>
        <Button
          size="sm"
          variant={challenge.joined ? "outline" : "primary"}
          onClick={() => onJoin(challenge.id)}
        >
          {challenge.joined ? "Joined" : "Join"}
        </Button>
      </div>
      <p className="text-xs text-gray-400 mb-3">{challenge.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>{challenge.goal}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{challenge.participants}</span>
      </div>
      {challenge.joined && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{challenge.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${challenge.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#DC2626] to-red-500"
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-600">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Ends {new Date(challenge.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        <span className="capitalize">{challenge.category}</span>
      </div>
    </motion.div>
  );
}

// ─── Leaderboard Row ───────────────────────────────────────────────────────────
function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser?: boolean }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isCurrentUser ? "bg-[#DC2626]/10 border border-[#DC2626]/30" : "bg-white/3 border border-white/5 hover:bg-white/5"
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
        entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
        entry.rank === 2 ? "bg-gray-300/20 text-gray-300" :
        entry.rank === 3 ? "bg-orange-600/20 text-orange-400" :
        "bg-white/5 text-gray-500"
      }`}>
        {entry.badge || entry.rank}
      </div>
      <Avatar avatar={entry.avatar} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{entry.name}</p>
        <p className="text-xs text-gray-500">{entry.category}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[#DC2626]">{entry.points.toLocaleString()}</p>
        <p className="text-[10px] text-gray-600">pts</p>
      </div>
    </motion.div>
  );
}

// ─── Badge Card ────────────────────────────────────────────────────────────────
function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <motion.div variants={itemVariants} {...cardHover} className="glass rounded-2xl p-4 border border-white/5 text-center">
      <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-3 ${
        badge.rarity === "legendary" ? "bg-yellow-500/20 ring-2 ring-yellow-500/30" :
        badge.rarity === "epic" ? "bg-purple-500/20 ring-2 ring-purple-500/30" :
        badge.rarity === "rare" ? "bg-blue-500/20 ring-2 ring-blue-500/30" :
        "bg-white/5 ring-2 ring-white/10"
      }`}>
        {badge.icon}
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{badge.name}</h4>
      <p className="text-xs text-gray-400 mb-2">{badge.description}</p>
      <div className="space-y-1.5">
        <RarityBadge rarity={badge.rarity} />
        <p className="text-[10px] text-gray-600">{badge.howToEarn}</p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CommunityHub() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stories, setStories] = useState<MemberStory[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [referral, setReferral] = useState<ReferralData>({ code: "", reward: "", totalReferrals: 0 });

  // Write review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  // Write story form
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [storyName, setStoryName] = useState("");

  // Referral
  const [referralCopied, setReferralCopied] = useState(false);

  // Leaderboard filter
  const [lbFilter, setLbFilter] = useState("Overall");
  const lbCategories = useMemo(() => ["Overall", ...new Set(leaderboard.map((e) => e.category))], [leaderboard]);

  useEffect(() => {
    setMounted(true);
    setReviews(getReviews());
    setStories(getStories());
    setTransformations(getTransformations());
    setChallenges(getChallenges());
    setLeaderboard(getLeaderboard());
    setBadges(getBadges());
    setReferral(getReferral());
  }, []);

  const tabs = [
    { id: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" /> },
    { id: "stories", label: "Stories", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "transformations", label: "Transformations", icon: <Activity className="w-4 h-4" /> },
    { id: "challenges", label: "Challenges", icon: <Zap className="w-4 h-4" /> },
    { id: "leaderboard", label: "Leaderboard", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "badges", label: "Badges & Referral", icon: <Award className="w-4 h-4" /> },
  ];

  const handleAddReview = () => {
    if (!newReviewText.trim()) return;
    const review: Review = {
      id: Math.random().toString(36).slice(2),
      name: reviewerName.trim() || "Anonymous",
      avatar: (reviewerName.trim() || "A").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase(),
      rating: newRating,
      text: newReviewText.trim(),
      date: new Date().toISOString(),
      tags: [],
    };
    setReviews(addReview(review));
    setShowReviewForm(false);
    setNewReviewText("");
    setReviewerName("");
    setNewRating(5);
    toast({ title: "Review posted!", variant: "success" });
  };

  const handleAddStory = () => {
    if (!storyText.trim() || !storyTitle.trim()) return;
    const story: MemberStory = {
      id: Math.random().toString(36).slice(2),
      title: storyTitle.trim(),
      memberName: storyName.trim() || "Anonymous",
      memberAvatar: (storyName.trim() || "A").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase(),
      story: storyText.trim(),
      tags: [],
      likes: 0,
      date: new Date().toISOString(),
    };
    setStories(addStory(story));
    setShowStoryForm(false);
    setStoryTitle("");
    setStoryText("");
    setStoryName("");
    toast({ title: "Story shared!", variant: "success" });
  };

  const handleLikeStory = (id: string) => {
    setStories(likeStory(id));
  };

  const handleJoinChallenge = (id: string) => {
    setChallenges(toggleChallengeJoin(id));
    const c = challenges.find((ch) => ch.id === id);
    toast({ title: c?.joined ? "Left challenge" : "Challenge joined!", variant: c?.joined ? "info" : "success" });
  };

  const handleCopyReferral = async () => {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referral.code}`;
    try {
      await navigator.clipboard.writeText(link);
      setReferralCopied(true);
      toast({ title: "Referral link copied!", variant: "success" });
      setTimeout(() => setReferralCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "error" });
    }
  };

  const handleShareReferral = async () => {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${referral.code}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Join Gym 56!", text: "Use my referral code and get started!", url: link });
        incrementReferral();
        setReferral(getReferral());
      } catch { /* user cancelled */ }
    } else {
      handleCopyReferral();
    }
  };

  const filteredLeaderboard = useMemo(
    () => leaderboard.filter((e) => e.category === lbFilter),
    [leaderboard, lbFilter]
  );

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* ═══ Hero ═══ */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-6 sm:p-10 border border-white/5 bg-gradient-to-br from-[#DC2626]/10 via-black to-transparent text-center sm:text-left">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black mb-4">
            <span className="text-[#DC2626]">Community</span> Hub
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            Connect with fellow members, share your journey, and celebrate every victory together.
            This is where the Gym 56 family comes alive.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4 text-[#DC2626]" />
              <span>500+ Active Members</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Trophy className="w-4 h-4 text-[#DC2626]" />
              <span>12 Challenges Running</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-[#DC2626]" />
              <span>50+ Transformations</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ Tab Nav ═══ */}
      <motion.div variants={itemVariants} className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin -mx-2 px-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* REVIEWS TAB */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "reviews" && (
        <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <SectionTitle icon={<Star className="w-5 h-5" />} title="Gym Reviews">
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-xs text-[#DC2626] hover:text-white font-semibold flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Write Review
            </button>
          </SectionTitle>

          <AnimatePresence>
            {showReviewForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <GlassCard className="mb-6">
                  <div className="space-y-4">
                    <Input label="Your Name" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} placeholder="Display name" />
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setNewRating(s)}>
                            <Star size={28} className={s <= newRating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Your Review</p>
                      <textarea
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Share your experience at Gym 56..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm px-4 py-2.5 min-h-[100px] focus:outline-none focus:border-[#DC2626] transition-colors"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleAddReview} disabled={!newReviewText.trim()}>Post Review</Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* STORIES TAB */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "stories" && (
        <motion.div key="stories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <SectionTitle icon={<MessageSquare className="w-5 h-5" />} title="Member Stories">
            <button onClick={() => setShowStoryForm(!showStoryForm)} className="text-xs text-[#DC2626] hover:text-white font-semibold flex items-center gap-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Share Story
            </button>
          </SectionTitle>

          <AnimatePresence>
            {showStoryForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <GlassCard className="mb-6">
                  <div className="space-y-4">
                    <Input label="Your Name" value={storyName} onChange={(e) => setStoryName(e.target.value)} placeholder="Display name" />
                    <Input label="Story Title" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} placeholder="e.g. My 6-Month Transformation" />
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Your Story</p>
                      <textarea
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        placeholder="Share your fitness journey..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm px-4 py-2.5 min-h-[120px] focus:outline-none focus:border-[#DC2626] transition-colors"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowStoryForm(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleAddStory} disabled={!storyText.trim() || !storyTitle.trim()}>Share Story</Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} onLike={handleLikeStory} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TRANSFORMATIONS TAB */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "transformations" && (
        <motion.div key="transformations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <SectionTitle icon={<Activity className="w-5 h-5" />} title="Transformations">
            <span className="text-xs text-gray-500">Real results from real members</span>
          </SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {transformations.map((t) => (
              <TransformationCard key={t.id} t={t} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CHALLENGES TAB */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "challenges" && (
        <motion.div key="challenges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <SectionTitle icon={<Zap className="w-5 h-5" />} title="Active Challenges">
            <span className="text-xs text-gray-500">{challenges.reduce((a, c) => a + c.participants, 0)} total participants</span>
          </SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((c) => (
              <ChallengeCard key={c.id} challenge={c} onJoin={handleJoinChallenge} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* LEADERBOARD TAB */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "leaderboard" && (
        <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <SectionTitle icon={<BarChart3 className="w-5 h-5" />} title="Leaderboard">
            <div className="flex gap-1.5">
              {lbCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLbFilter(cat)}
                  className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-medium transition-all ${
                    lbFilter === cat ? "bg-[#DC2626] text-white" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </SectionTitle>

          <GlassCard>
            <div className="space-y-2">
              {filteredLeaderboard.slice(0, 10).map((entry, i) => (
                <LeaderboardRow key={entry.id} entry={{ ...entry, rank: i + 1 }} isCurrentUser={i === 2} />
              ))}
            </div>
            {filteredLeaderboard.length > 10 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <button className="text-xs text-gray-500 hover:text-white transition-colors w-full text-center">
                  View all {filteredLeaderboard.length} entries
                </button>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* BADGES & REFERRAL TAB */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "badges" && (
        <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Badges */}
          <SectionTitle icon={<Award className="w-5 h-5" />} title="Badges & Achievements">
            <span className="text-xs text-gray-500">Earn them all</span>
          </SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {badges.map((b) => (
              <BadgeCard key={b.id} badge={b} />
            ))}
          </div>

          {/* Referral System */}
          <SectionTitle icon={<Gift className="w-5 h-5" />} title="Referral Program" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-[#DC2626]/20 bg-gradient-to-br from-[#DC2626]/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-[#DC2626]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Refer a Friend</h3>
                  <p className="text-sm text-gray-400">Share the fitness journey</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-xs text-gray-500">Your Referral Code</p>
                    <p className="text-lg font-mono font-bold text-[#DC2626]">{referral.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCopyReferral} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all" title="Copy link">
                      {referralCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={handleShareReferral} className="p-2 rounded-xl bg-[#DC2626]/20 hover:bg-[#DC2626]/30 text-[#DC2626] transition-all" title="Share">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5 flex-1">
                    <p className="text-2xl font-black text-white">{referral.totalReferrals}</p>
                    <p className="text-xs text-gray-500">Referrals</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5 flex-1">
                    <p className="text-2xl font-black text-green-400">{referral.reward}</p>
                    <p className="text-xs text-gray-500">Reward per referral</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5 border border-white/5 flex-1">
                    <p className="text-2xl font-black text-[#DC2626]">Unlimited</p>
                    <p className="text-xs text-gray-500">Max referrals</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/5">
              <SectionTitle icon={<Sparkles className="w-5 h-5" />} title="How It Works" />
              <div className="space-y-4">
                {[
                  { step: "1", icon: <UserPlus className="w-5 h-5" />, title: "Share your code", desc: "Send your unique referral link to friends and family" },
                  { step: "2", icon: <Users className="w-5 h-5" />, title: "They sign up", desc: "Your friends join Gym 56 using your referral code" },
                  { step: "3", icon: <Gift className="w-5 h-5" />, title: "Earn rewards", desc: "Get 1 month free for every friend who signs up!" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0 text-[#DC2626]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Social Share Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Share2 className="w-5 h-5" />, title: "Share Your Progress", desc: "Post your workouts and inspire others", color: "from-blue-500/10 to-transparent border-blue-500/20" },
              { icon: <Flame className="w-5 h-5" />, title: "Challenge Friends", desc: "Invite friends to join active challenges", color: "from-orange-500/10 to-transparent border-orange-500/20" },
              { icon: <Trophy className="w-5 h-5" />, title: "Celebrate Wins", desc: "Share your achievements with the community", color: "from-yellow-500/10 to-transparent border-yellow-500/20" },
            ].map((card) => (
              <motion.div key={card.title} variants={itemVariants} {...cardHover} className={`glass rounded-2xl p-5 border bg-gradient-to-br ${card.color}`}>
                <div className="text-[#DC2626] mb-3">{card.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
                <p className="text-xs text-gray-400">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
