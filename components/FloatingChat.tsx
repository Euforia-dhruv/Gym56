"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  User,
  Loader2,
  Bot,
  AlertCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      setIsLoading(true);
      setError(null);
      setInput("");

      const userMsg: ChatMessage = { id: genId(), role: "user", content: text };
      const assistantMsg: ChatMessage = { id: genId(), role: "assistant", content: "" };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const history = messages.concat(userMsg).map((m) => ({
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
    },
    [messages, isLoading]
  );

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

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
          isOpen
            ? "bg-[#DC2626]/80 hover:bg-[#DC2626]"
            : "bg-[#DC2626] hover:bg-[#B91C1C]"
        }`}
        aria-label={isOpen ? "Close AI Coach chat" : "Open AI Coach chat"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" aria-hidden="true" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Gym56 AI Coach chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[480px] sm:h-[32rem] flex flex-col rounded-2xl glass border border-white/10 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DC2626]/20 to-red-800/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#DC2626]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Gym56 AI Coach
                  </h2>
                  <p className="text-[10px] text-gray-500">
                    {isLoading ? "Thinking..." : error ? "Error" : "Online"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DC2626]/10 to-red-800/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-[#DC2626]" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">
                    How can I help?
                  </h3>
                  <p className="text-gray-500 text-xs max-w-[200px]">
                    Ask about workouts, nutrition, form, or anything fitness
                  </p>
                </div>
              )}

              {error && (
                <div className="glass rounded-xl p-3 border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 font-medium text-xs">
                      Connection error
                    </p>
                    <p className="text-yellow-400/70 text-[10px] mt-0.5">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {m.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#DC2626]/20 to-red-800/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                        m.role === "user"
                          ? "bg-[#DC2626]/10 border border-[#DC2626]/20"
                          : "bg-white/5 border border-white/5"
                      }`}
                    >
                      <p className="text-xs leading-relaxed whitespace-pre-wrap text-gray-200">
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
                      <div className="w-7 h-7 rounded-lg bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-[#DC2626]" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-white/10 bg-black/40">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    rows={1}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] transition-all text-white placeholder-gray-600 resize-none text-xs"
                    style={{ minHeight: "38px", maxHeight: "80px" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white flex items-center justify-center flex-shrink-0"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
