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
  Copy,
  Check,
  RefreshCw,
  Square,
  WifiOff,
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
    query: "Create a weekly workout routine for me based on my goals",
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
    query: "Create a fat loss plan with workouts and nutrition guidance",
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
    query: "What should I eat before and after workouts?",
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
  const [notConnected, setNotConnected] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

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
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopGenerating = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(async (text: string, retryId?: string) => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setNotConnected(false);
    setShowPrompts(false);
    setInput("");

    const userMessage: Message = { id: generateId(), role: "user", content: text };
    const assistantMessage: Message = { id: generateId(), role: "assistant", content: "" };

    if (retryId) {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === retryId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = assistantMessage;
          return updated;
        }
        return prev;
      });
    } else {
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = (retryId
        ? messages.slice(0, -1)
        : messages
      ).concat(userMessage).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (res.status === 503) {
        setNotConnected(true);
        setMessages((prev) => prev.slice(0, retryId ? -1 : -2));
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (!content) continue;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  updated[updated.length - 1] = { ...last, content: last.content + content };
                }
                return updated;
              });
            } catch {}
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant" && !last.content) {
            return updated.slice(0, -1);
          }
          return updated;
        });
        return;
      }
      setError("Failed to get response. Please try again.");
      setMessages((prev) => prev.slice(0, retryId ? -1 : -2));
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
    stopGenerating();
    setMessages([]);
    setInput("");
    setError(null);
    setNotConnected(false);
    setShowPrompts(true);
  };

  const handlePromptClick = (query: string) => {
    sendMessage(query);
  };

  const handleRegenerate = (msgId: string) => {
    const userMsg = messages.findLast((m) => m.role === "user");
    if (userMsg) {
      sendMessage(userMsg.content, msgId);
    }
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
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
            Get expert-level workout plans, nutrition guidance, and fitness advice — powered by Gym 56.
          </motion.p>

          {!notConnected && (
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
          )}
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
              <p className="text-xs text-gray-500">Powered by Gym 56</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <button
                onClick={stopGenerating}
                className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Stop generating"
                title="Stop"
              >
                <Square className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClear}
              className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin"
        >
          {messages.length === 0 && showPrompts && !notConnected && (
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

          {notConnected && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6">
                <WifiOff className="w-10 h-10 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">AI Coach is not connected yet</h2>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                The AI Coach needs an API key to work. Once connected, you will be able to ask anything about workouts, nutrition, and fitness.
              </p>
            </motion.div>
          )}

          {error && (
            <div className="glass rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-yellow-300 font-medium text-sm">Connection error</p>
                <p className="text-yellow-400/70 text-xs mt-1">{error}</p>
              </div>
              <button
                onClick={() => {
                  const lastUserMsg = messages.findLast((m) => m.role === "user");
                  if (lastUserMsg) sendMessage(lastUserMsg.content);
                }}
                className="text-yellow-300 text-xs font-medium hover:underline flex-shrink-0"
              >
                Try again
              </button>
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
                <div className="max-w-[85%] sm:max-w-[75%]">
                  <div
                    className={`rounded-2xl px-5 py-3.5 ${
                      m.role === "user"
                        ? "bg-[#DC2626]/10 border border-[#DC2626]/20 text-white"
                        : "glass border border-white/5 text-gray-200"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content}
                      {m.role === "assistant" && m.content === "" && isLoading && (
                        <span className="inline-flex gap-1 ml-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      )}
                    </div>
                  </div>
                  {m.role === "assistant" && m.content && (
                    <div className="flex items-center gap-2 mt-1.5 px-2">
                      <button
                        onClick={() => handleCopy(m.content, m.id)}
                        className="text-gray-600 hover:text-white transition-colors"
                        aria-label="Copy response"
                        title="Copy"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRegenerate(m.id)}
                        disabled={isLoading}
                        className="text-gray-600 hover:text-white transition-colors disabled:opacity-30"
                        aria-label="Regenerate response"
                        title="Regenerate"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-[#DC2626]" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {notConnected && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-5 border border-yellow-500/20 bg-yellow-500/5 text-center"
            >
              <WifiOff className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-300 font-medium text-sm">AI Coach is not connected yet</p>
              <p className="text-yellow-400/70 text-xs mt-1">An API key is required to enable AI responses.</p>
            </motion.div>
          )}

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
                placeholder={notConnected ? "AI Coach is not connected yet" : "Ask your AI coach anything..."}
                rows={1}
                disabled={notConnected}
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] transition-all text-white placeholder-gray-600 resize-none text-sm disabled:opacity-30"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim() || notConnected}
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
