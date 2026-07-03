"use client";

import * as React from "react";
import { Mail, MailOpen, Clock, Phone, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/admin/SearchBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cn, truncate } from "@/lib/utils";
import {
  getContactMessages,
  markAsRead,
  markAllAsRead,
  deleteContactMessage,
} from "@/lib/actions/contact";
import type { ContactSubmission } from "@/types";

export default function ContactPage() {
  const [messages, setMessages] = React.useState<ContactSubmission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<ContactSubmission | null>(null);
  const [query, setQuery] = React.useState("");
  const [deleteConfirm, setDeleteConfirm] = React.useState<ContactSubmission | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    getContactMessages()
      .then((data) => {
        setMessages(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const filtered = query
    ? messages.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          (m.subject ?? "").toLowerCase().includes(query.toLowerCase()) ||
          m.message.toLowerCase().includes(query.toLowerCase())
      )
    : messages;

  const handleSelect = async (msg: ContactSubmission) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await markAsRead(msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        );
      } catch {
        // Silently fail
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
    } catch {
      // Silently fail
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteContactMessage(deleteConfirm.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
      if (selected?.id === deleteConfirm.id) {
        setSelected(messages.find((m) => m.id !== deleteConfirm.id) || null);
      }
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-accent animate-spin" aria-label="Loading…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Inbox"
        description="Messages submitted through the public contact form."
      >
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </PageHeader>

      {/* Stats row */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] border border-white/8 text-sm">
          <Mail className="w-4 h-4 text-blue-400" aria-hidden="true" />
          <span className="text-white font-semibold">{unreadCount}</span>
          <span className="text-gray-500">unread</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] border border-white/8 text-sm">
          <MailOpen className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span className="text-white font-semibold">{messages.length - unreadCount}</span>
          <span className="text-gray-500">read</span>
        </div>
      </div>

      {/* Inbox layout */}
      <div className="flex flex-col lg:flex-row gap-0 rounded-2xl border border-white/8 overflow-hidden bg-[#0d0d0d] min-h-[540px]">
        {/* Message list */}
        <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-white/8 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-white/8">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search messages…"
            />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Mail className="w-6 h-6" />}
                title="No messages found"
              />
            ) : (
              filtered.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  isSelected={selected?.id === msg.id}
                  onSelect={() => handleSelect(msg)}
                />
              ))
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              <div className="px-6 py-5 border-b border-white/8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selected.subject || "(No subject)"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-sm text-gray-300">{selected.name}</span>
                      <span className="text-sm text-gray-500">{selected.email}</span>
                      {selected.phone && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                          {selected.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!selected.is_read ? (
                      <Badge variant="info" dot size="sm">Unread</Badge>
                    ) : (
                      <Badge variant="default" size="sm">Read</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {new Date(selected.created_at).toLocaleString("en-IN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              <div className="px-6 py-4 border-t border-white/8 bg-[#0a0a0a]">
                <p className="text-xs text-gray-600 mb-3">
                  Reply via email:{" "}
                  <a href={`mailto:${selected.email}`} className="text-accent hover:underline">
                    {selected.email}
                  </a>
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Gym 56 Enquiry"}`}>
                      Reply via Email
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => setDeleteConfirm(selected)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<Mail className="w-8 h-8" />}
                title={messages.length === 0 ? "No messages yet" : "Select a message"}
                description={
                  messages.length === 0
                    ? "Messages from the contact form will appear here."
                    : "Choose a message from the list to view its details."
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        description={`Delete message from "${deleteConfirm?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}

// ─── Message Item Component ─────────────────────────────────────────────────

function MessageItem({
  message,
  isSelected,
  onSelect,
}: {
  message: ContactSubmission;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const date = new Date(message.created_at);
  const timeStr = date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={onSelect}
      aria-current={isSelected ? "true" : undefined}
      className={cn(
        "w-full text-left px-4 py-4 border-b border-white/6 transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
        isSelected
          ? "bg-accent/10 border-l-2 border-l-accent"
          : "hover:bg-white/3",
        !message.is_read && !isSelected && "border-l-2 border-l-blue-500"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          {!message.is_read ? (
            <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" aria-label="Unread" />
          ) : (
            <MailOpen className="w-4 h-4 text-gray-500 flex-shrink-0" aria-label="Read" />
          )}
          <span
            className={cn(
              "text-sm truncate",
              message.is_read ? "text-gray-300 font-normal" : "text-white font-semibold"
            )}
          >
            {message.name}
          </span>
        </div>
        <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
          {timeStr}
        </span>
      </div>
      <p
        className={cn(
          "text-xs mb-1 truncate",
          message.is_read ? "text-gray-500" : "text-gray-300 font-medium"
        )}
      >
        {message.subject || "(No subject)"}
      </p>
      <p className="text-xs text-gray-600 truncate">
        {truncate(message.message, 80)}
      </p>
    </button>
  );
}
