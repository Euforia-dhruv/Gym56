"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Sparkles,
  Dumbbell,
  Apple,
  Heart,
  Brain,
  ArmchairIcon as Accessibility,
  Loader2,
  Trash2,
  AlertCircle,
  Flame,
  TrendingUp,
  BookOpen,
  Bot,
  Crown,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Workout Generation",
    description: "Custom push/pull/legs splits, full-body routines, and sport-specific training programs",
    query: "Create a comprehensive weekly workout routine for me based on my goals",
  },
  {
    icon: BookOpen,
    title: "Beginner Guidance",
    description: "Step-by-step introduction to gym equipment, proper form, and building confidence",
    query: "I'm completely new to the gym. Give me a beginner routine with detailed instructions",
  },
  {
    icon: Flame,
    title: "Fat Loss Plans",
    description: "Calorie-deficit meal plans, HIIT cardio programming, and fat-burning strategies",
    query: "Create a detailed fat loss plan with workouts and nutrition guidance",
  },
  {
    icon: TrendingUp,
    title: "Muscle Gain Plans",
    description: "Progressive overload programs, bulking nutrition, and recovery optimization",
    query: "Give me a muscle building program with progressive overload and nutrition advice",
  },
  {
    icon: Apple,
    title: "Nutrition Advice",
    description: "Pre/post-workout meals, macro tracking, supplements, and diet personalization",
    query: "What's the best nutrition plan for someone trying to build muscle and lose fat?",
  },
  {
    icon: Heart,
    title: "Exercise Form",
    description: "Proper technique analysis, common form mistakes, and injury prevention tips",
    query: "How do I properly perform a barbell squat? Include common mistakes to avoid",
  },
];

const SUGGESTED_PROMPTS = [
  { icon: Dumbbell, label: "Create a push workout", query: "Create a push workout routine for me" },
  { icon: Apple, label: "Nutrition tips", query: "What should I eat before and after a workout?" },
  { icon: Brain, label: "Exercise form", query: "How do I properly perform a barbell squat?" },
  { icon: Heart, label: "Weight loss plan", query: "Give me a weekly weight loss workout plan" },
  { icon: Accessibility, label: "Beginner routine", query: "I'm new to the gym. What routine should I start with?" },
  { icon: Dumbbell, label: "Muscle gain", query: "What's the best approach for building muscle?" },
];

const STORAGE_KEY = "gym56_coach_messages";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function AiCoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setShowPrompts(false);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setShowPrompts(false);
    setInput("");

    const userMessage: Message = { id: generateId(), role: "user", content: text };
    const assistantMessage: Message = { id: generateId(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = messages.concat(userMessage).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = { ...last, content: last.content + chunk };
            }
            return updated;
          });
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Failed to get response. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClear = () => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setInput("");
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    setShowPrompts(true);
  };

  const handlePromptClick = (query: string) => {
    sendMessage(query);
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      setMessages((prev) => prev.slice(0, -1));
      sendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#DC2626]/5 via-transparent to-black pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#DC2626]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#DC2626]/20 to-red-800/20 border border-[#DC2626]/30 text-[#DC2626] text-xs font-semibold uppercase tracking-wider mb-6">
            <Crown className="w-3.5 h-3.5" />
            Premium Feature
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Your Personal
            <span className="bg-gradient-to-r from-[#DC2626] to-red-400 bg-clip-text text-transparent"> AI Coach</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-8"
          >
            Get expert-level workout plans, nutrition guidance, and fitness advice — powered by Gym 56&apos;s premium AI.
          </motion.p>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12"
          >
            {FEATURES.map((feature) => (
              <button
                key={feature.title}
                onClick={() => handlePromptClick(feature.query)}
                className="glass rounded-xl p-5 hover:border-[#DC2626]/30 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626]/20 to-red-800/20 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-[#DC2626]" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-[#DC2626] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Chat Section */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 flex flex-col">
        <div className="py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626]/20 to-red-800/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#DC2626]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Coach Chat</h2>
              <p className="text-xs text-gray-500">
                {process.env.NEXT_PUBLIC_OPENAI_API_KEY ? "Powered by GPT-4o-mini" : "Powered by Gym 56"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
          {messages.length === 0 && showPrompts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DC2626]/10 to-red-800/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-[#DC2626]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
              <p className="text-gray-500 mb-8">Ask me about workouts, nutrition, form, or anything fitness</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    onClick={() => handlePromptClick(prompt.query)}
                    className="glass rounded-xl p-4 text-left hover:border-[#DC2626]/30 transition-all group"
                  >
                    <prompt.icon className="w-5 h-5 text-[#DC2626] mb-2" />
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{prompt.label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {error && (
            <div className="glass rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-medium text-sm">Connection error</p>
                <p className="text-yellow-400/70 text-xs mt-1">{error}</p>
                <button onClick={handleRetry} className="text-yellow-300 text-xs font-medium mt-2 hover:underline">
                  Try again
                </button>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#DC2626]/20 to-red-800/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-[#DC2626]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 ${
                    m.role === "user"
                      ? "bg-[#DC2626]/10 border border-[#DC2626]/20 text-white"
                      : "glass border border-white/5 text-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {m.content}
                    {m.role === "assistant" && m.content === "" && isLoading && (
                      <span className="inline-flex gap-1 ml-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    )}
                  </p>
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-[#DC2626]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="py-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI coach anything..."
                rows={1}
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] transition-all text-white placeholder-gray-600 resize-none text-sm"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <p className="text-[10px] text-gray-600 mt-2 text-center">
            AI Coach provides general fitness guidance. Always consult a doctor before starting any fitness program.
          </p>
        </div>
      </div>
    </div>
  );
}
