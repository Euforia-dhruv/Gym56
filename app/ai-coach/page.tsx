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
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

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
    <div className="min-h-screen bg-black pt-20 flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 flex flex-col">
        <div className="py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626]/20 to-red-800/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#DC2626]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Coach</h1>
              <p className="text-xs text-gray-500">Powered by Gym 56</p>
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
