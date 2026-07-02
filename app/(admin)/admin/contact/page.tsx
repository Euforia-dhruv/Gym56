"use client";

import * as React from "react";
import { Mail, MailOpen, Clock, Phone } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/admin/SearchBar";
import { EmptyState } from "@/components/admin/EmptyState";
import { cn, truncate } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const MOCK_MESSAGES: ContactMessage[] = [
  {
    id: "1",
    name: "Ravi Patel",
    email: "ravi@example.com",
    phone: "+91 98765 33333",
    subject: "Membership Enquiry",
    message:
      "Hi, I wanted to know about the 6-month membership plan. Do you offer any discounts for students? I am currently studying at Nirma University and would love to join your gym.",
    isRead: false,
    createdAt: "2026-07-02T09:15:00",
  },
  {
    id: "2",
    name: "Pooja Desai",
    email: "pooja@example.com",
    phone: null,
    subject: "Personal Training Sessions",
    message:
      "Hello, I am interested in personal training. Could you please share information about your personal trainer availability and pricing? I am a beginner and need proper guidance.",
    isRead: false,
    createdAt: "2026-07-02T07:45:00",
  },
  {
    id: "3",
    name: "Vishal Kumar",
    email: "vishal@example.com",
    phone: "+91 98765 55544",
    subject: "Equipment Feedback",
    message:
      "The treadmill on the ground floor (machine #3) seems to have an issue with the belt. It makes a squeaking noise after 10 minutes. Please look into it.",
    isRead: false,
    createdAt: "2026-07-01T17:30:00",
  },
  {
    id: "4",
    name: "Sonal Mehta",
    email: "sonal@example.com",
    phone: "+91 98765 66655",
    subject: "Opening Hours",
    message:
      "What are your opening hours during public holidays? I could not find this information on the website. Planning to come on Independence Day.",
    isRead: true,
    createdAt: "2026-06-30T12:00:00",
  },
  {
    id: "5",
    name: "Tarun Joshi",
    email: "tarun@example.com",
    phone: null,
    subject: "Group Classes Schedule",
    message:
      "Hi! Do you have Zumba or yoga classes? If yes, what is the schedule and is there an additional charge for these classes?",
    isRead: true,
    createdAt: "2026-06-29T10:30:00",
  },
];

// ─── Message Item ─────────────────────────────────────────────────────────────

function MessageItem({
  message,
  isSelected,
  onSelect,
}: {
  message: ContactMessage;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const date = new Date(message.createdAt);
  const timeStr = date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        "w-full text-left px-4 py-4 border-b border-white/6 transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
        isSelected
          ? "bg-accent/10 border-l-2 border-l-accent"
          : "hover:bg-white/3",
        !message.isRead && !isSelected && "border-l-2 border-l-blue-500"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          {!message.isRead ? (
            <Mail
              className="w-4 h-4 text-blue-400 flex-shrink-0"
              aria-label="Unread"
            />
          ) : (
            <MailOpen
              className="w-4 h-4 text-gray-500 flex-shrink-0"
              aria-label="Read"
            />
          )}
          <span
            className={cn(
              "text-sm truncate",
              message.isRead
                ? "text-gray-300 font-normal"
                : "text-white font-semibold"
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
          message.isRead ? "text-gray-500" : "text-gray-300 font-medium"
        )}
      >
        {message.subject}
      </p>
      <p className="text-xs text-gray-600 truncate">
        {truncate(message.message, 80)}
      </p>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [selected, setSelected] = React.useState<ContactMessage | null>(
    MOCK_MESSAGES[0]
  );
  const [messages, setMessages] = React.useState(MOCK_MESSAGES);
  const [query, setQuery] = React.useState("");

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filtered = query
    ? messages.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.subject.toLowerCase().includes(query.toLowerCase()) ||
          m.message.toLowerCase().includes(query.toLowerCase())
      )
    : messages;

  const handleSelect = (msg: ContactMessage) => {
    setSelected(msg);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
    );
  };

  const handleMarkAllRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
  };

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
          <span className="text-white font-semibold">
            {messages.length - unreadCount}
          </span>
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
          <div className="flex-1 overflow-y-auto">
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
              {/* Detail header */}
              <div className="px-6 py-5 border-b border-white/8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selected.subject}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-sm text-gray-300">
                        {selected.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {selected.email}
                      </span>
                      {selected.phone && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                          {selected.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!selected.isRead ? (
                      <Badge variant="info" dot size="sm">
                        Unread
                      </Badge>
                    ) : (
                      <Badge variant="default" size="sm">
                        Read
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {new Date(selected.createdAt).toLocaleString("en-IN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Message body */}
              <div className="flex-1 p-6">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              {/* Reply footer (placeholder) */}
              <div className="px-6 py-4 border-t border-white/8 bg-[#0a0a0a]">
                <p className="text-xs text-gray-600 mb-3">
                  Reply via email:{" "}
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-accent hover:underline"
                  >
                    {selected.email}
                  </a>
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    >
                      Reply via Email
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
                title="Select a message"
                description="Choose a message from the list to view its details."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
