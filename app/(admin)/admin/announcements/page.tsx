"use client";

import * as React from "react";
import {
  Plus,
  Megaphone,
  Info,
  AlertTriangle,
  AlertOctagon,
  CalendarDays,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const STORAGE_KEY = "gym56_announcements";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "urgent" | "event";
  date: string;
  active: boolean;
}

const TYPE_OPTIONS = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "urgent", label: "Urgent" },
  { value: "event", label: "Event" },
];

const typeConfig: Record<string, { variant: "info" | "warning" | "danger" | "success"; icon: React.ReactNode; label: string }> = {
  info: { variant: "info", icon: <Info className="w-4 h-4" />, label: "Info" },
  warning: { variant: "warning", icon: <AlertTriangle className="w-4 h-4" />, label: "Warning" },
  urgent: { variant: "danger", icon: <AlertOctagon className="w-4 h-4" />, label: "Urgent" },
  event: { variant: "success", icon: <CalendarDays className="w-4 h-4" />, label: "Event" },
};

function seedAnnouncements(): Announcement[] {
  const now = new Date();
  return [
    { id: "1", title: "New Equipment Arrived", message: "We've added new treadmills and cycling bikes to the cardio zone. Come check them out!", type: "info", date: new Date(now.getTime() - 86400000 * 2).toISOString(), active: true },
    { id: "2", title: "Holiday Schedule Change", message: "The gym will close at 4 PM on Republic Day (Jan 26). Regular hours resume the next day.", type: "warning", date: new Date(now.getTime() - 86400000 * 5).toISOString(), active: true },
    { id: "3", title: "Water Outage Notice", message: "Due to maintenance, water supply will be disrupted from 10 AM to 12 PM on Saturday. We apologize for the inconvenience.", type: "urgent", date: new Date(now.getTime() - 86400000 * 1).toISOString(), active: true },
    { id: "4", title: "Yoga Workshop This Sunday", message: "Join us for a special yoga workshop this Sunday at 8 AM. Free for all members!", type: "event", date: new Date(now.getTime() + 86400000 * 3).toISOString(), active: false },
  ];
}

function loadAnnouncements(): Announcement[] {
  if (typeof window === "undefined") return seedAnnouncements();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Announcement[];
    } catch {
      // fall through
    }
  }
  const data = seedAnnouncements();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveAnnouncements(data: Announcement[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Announcement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Announcement | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Form
  const [formTitle, setFormTitle] = React.useState("");
  const [formMessage, setFormMessage] = React.useState("");
  const [formType, setFormType] = React.useState<"info" | "warning" | "urgent" | "event">("info");
  const [formActive, setFormActive] = React.useState(true);

  React.useEffect(() => {
    setAnnouncements(loadAnnouncements());
    setLoading(false);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormTitle("");
    setFormMessage("");
    setFormType("info");
    setFormActive(true);
    setModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setFormTitle(a.title);
    setFormMessage(a.message);
    setFormType(a.type);
    setFormActive(a.active);
    setModalOpen(true);
  };

  const toggleActive = (announcement: Announcement) => {
    const updated: Announcement = { ...announcement, active: !announcement.active };
    const next = announcements.map((a) => (a.id === announcement.id ? updated : a));
    setAnnouncements(next);
    saveAnnouncements(next);
    toast({ title: updated.active ? "Announcement activated" : "Announcement deactivated", variant: "success" });
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formMessage.trim()) {
      toast({ title: "Title and message are required", variant: "error" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    try {
      if (editing) {
        const updated: Announcement = { ...editing, title: formTitle.trim(), message: formMessage.trim(), type: formType, active: formActive };
        const next = announcements.map((a) => (a.id === editing.id ? updated : a));
        setAnnouncements(next);
        saveAnnouncements(next);
        toast({ title: "Announcement updated", variant: "success" });
      } else {
        const created: Announcement = {
          id: generateId(),
          title: formTitle.trim(),
          message: formMessage.trim(),
          type: formType,
          date: new Date().toISOString(),
          active: formActive,
        };
        const next = [created, ...announcements];
        setAnnouncements(next);
        saveAnnouncements(next);
        toast({ title: "Announcement created", variant: "success" });
      }
      setModalOpen(false);
    } catch {
      toast({ title: "Error saving", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 300));
    const next = announcements.filter((a) => a.id !== deleteConfirm.id);
    setAnnouncements(next);
    saveAnnouncements(next);
    setDeleting(false);
    setDeleteConfirm(null);
    toast({ title: "Announcement deleted", variant: "success" });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Manage gym announcements and notifications.">
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Announcement
        </Button>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-8 h-8" />}
          title="No announcements"
          description="Create your first announcement to notify members."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              Add Announcement
            </Button>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {announcements.map((item) => {
            const cfg = typeConfig[item.type];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "glass rounded-2xl p-6 flex flex-col border-l-4 transition-all",
                  item.type === "info" && "border-l-blue-500",
                  item.type === "warning" && "border-l-yellow-500",
                  item.type === "urgent" && "border-l-red-500",
                  item.type === "event" && "border-l-green-500",
                  !item.active && "opacity-60",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={cfg.variant} size="sm" className="flex items-center gap-1">
                    {cfg.icon}
                    {cfg.label}
                  </Badge>
                  <button
                    onClick={() => toggleActive(item)}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      item.active
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-gray-600 hover:text-gray-400 hover:bg-white/5",
                    )}
                    aria-label={item.active ? "Deactivate" : "Activate"}
                  >
                    {item.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed flex-1">{item.message}</p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
                  <span className="text-xs text-gray-600">{formatDate(item.date)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                      aria-label={`Edit ${item.title}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      aria-label={`Delete ${item.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? "Edit Announcement" : "Add Announcement"}
        description={editing ? `Editing "${editing.title}"` : "Create a new announcement."}
        size="md"
      >
        <div className="space-y-4">
          <Input label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Announcement title" />
          <Select
            label="Type"
            options={TYPE_OPTIONS}
            value={formType}
            onChange={(e) => setFormType(e.target.value as Announcement["type"])}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="w-4 h-4 accent-accent rounded"
            />
            <label htmlFor="active" className="text-sm text-gray-300 cursor-pointer">Active</label>
          </div>
          <Textarea label="Message" value={formMessage} onChange={(e) => setFormMessage(e.target.value)} placeholder="Announcement message…" rows={5} />
          <div className="flex justify-end gap-3 pt-2">
            <Button size="sm" variant="outline" onClick={() => { setModalOpen(false); setEditing(null); }}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={handleSave}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        description={`Delete "${deleteConfirm?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
