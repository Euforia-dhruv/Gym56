"use client";

import * as React from "react";
import {
  Plus,
  Star,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Column } from "@/components/ui/Table";
import { cn, getInitials, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const STORAGE_KEY = "gym56_testimonials";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  date: string;
  featured: boolean;
}

const RATING_OPTIONS = ["All", "5", "4", "3", "2", "1"];

function seedTestimonials(): Testimonial[] {
  const now = new Date();
  return [
    { id: "1", name: "Arjun Mehta", role: "Member since 2023", avatar: "", text: "Gym 56 has completely transformed my fitness journey. The trainers are incredibly knowledgeable and the equipment is top-notch.", rating: 5, date: new Date(now.getTime() - 86400000 * 5).toISOString(), featured: true },
    { id: "2", name: "Sneha Patil", role: "Yoga Enthusiast", avatar: "", text: "The yoga classes at Gym 56 are amazing. I've never felt more flexible and relaxed. Highly recommend to everyone!", rating: 5, date: new Date(now.getTime() - 86400000 * 12).toISOString(), featured: true },
    { id: "3", name: "Vikram Singh", role: "Bodybuilder", avatar: "", text: "Great atmosphere and even better equipment. The free weights section is my favorite place to be.", rating: 4, date: new Date(now.getTime() - 86400000 * 20).toISOString(), featured: false },
    { id: "4", name: "Priya Patel", role: "Group Class Regular", avatar: "", text: "The group classes are so much fun! The instructors keep everyone motivated and the energy is contagious.", rating: 5, date: new Date(now.getTime() - 86400000 * 25).toISOString(), featured: true },
    { id: "5", name: "Rahul Desai", role: "PT Client", avatar: "", text: "Personal training with Raj has been incredible. I've seen results I never thought possible in just 3 months.", rating: 4, date: new Date(now.getTime() - 86400000 * 30).toISOString(), featured: false },
    { id: "6", name: "Ananya Reddy", role: "Swimmer", avatar: "", text: "Decent gym overall but I wish the pool hours were longer. The staff is friendly and helpful.", rating: 3, date: new Date(now.getTime() - 86400000 * 35).toISOString(), featured: false },
  ];
}

function loadTestimonials(): Testimonial[] {
  if (typeof window === "undefined") return seedTestimonials();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Testimonial[];
    } catch {
      // fall through
    }
  }
  const data = seedTestimonials();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveTestimonials(data: Testimonial[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-colors hover:scale-110"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn("w-5 h-5", star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-600")}
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn("w-3.5 h-3.5", star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600")}
        />
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = getInitials(name);
  const colors = [
    "bg-red-500/20 text-red-400",
    "bg-blue-500/20 text-blue-400",
    "bg-green-500/20 text-green-400",
    "bg-yellow-500/20 text-yellow-400",
    "bg-purple-500/20 text-purple-400",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0", color)}>
      {initials}
    </div>
  );
}

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [ratingFilter, setRatingFilter] = React.useState("All");
  const [featuredFilter, setFeaturedFilter] = React.useState("All");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Testimonial | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Form
  const [formName, setFormName] = React.useState("");
  const [formRole, setFormRole] = React.useState("");
  const [formText, setFormText] = React.useState("");
  const [formRating, setFormRating] = React.useState(5);
  const [formFeatured, setFormFeatured] = React.useState(false);

  React.useEffect(() => {
    setTestimonials(loadTestimonials());
    setLoading(false);
  }, []);

  const filtered = testimonials.filter((t) => {
    const ratingMatch = ratingFilter === "All" || t.rating === Number(ratingFilter);
    const featuredMatch =
      featuredFilter === "All" ||
      (featuredFilter === "featured" && t.featured) ||
      (featuredFilter === "regular" && !t.featured);
    return ratingMatch && featuredMatch;
  });

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormRole("");
    setFormText("");
    setFormRating(5);
    setFormFeatured(false);
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setFormName(t.name);
    setFormRole(t.role);
    setFormText(t.text);
    setFormRating(t.rating);
    setFormFeatured(t.featured);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formText.trim()) {
      toast({ title: "Name and testimonial text are required", variant: "error" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    try {
      if (editing) {
        const updated: Testimonial = { ...editing, name: formName.trim(), role: formRole.trim(), text: formText.trim(), rating: formRating, featured: formFeatured, avatar: "" };
        const next = testimonials.map((t) => (t.id === editing.id ? updated : t));
        setTestimonials(next);
        saveTestimonials(next);
        toast({ title: "Testimonial updated", variant: "success" });
      } else {
        const created: Testimonial = {
          id: generateId(),
          name: formName.trim(),
          role: formRole.trim(),
          avatar: "",
          text: formText.trim(),
          rating: formRating,
          featured: formFeatured,
          date: new Date().toISOString(),
        };
        const next = [created, ...testimonials];
        setTestimonials(next);
        saveTestimonials(next);
        toast({ title: "Testimonial created", variant: "success" });
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
    const next = testimonials.filter((t) => t.id !== deleteConfirm.id);
    setTestimonials(next);
    saveTestimonials(next);
    setDeleting(false);
    setDeleteConfirm(null);
    toast({ title: "Testimonial deleted", variant: "success" });
  };

  const columns: Column<Testimonial>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} />
          <div>
            <p className="font-semibold text-white text-sm">{row.name}</p>
            <p className="text-xs text-gray-500">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: "text",
      header: "Testimonial",
      render: (_, row) => <span className="text-gray-400 text-sm line-clamp-2 max-w-xs">{row.text}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (val) => <StarDisplay rating={Number(val)} />,
    },
    {
      key: "featured",
      header: "Featured",
      sortable: true,
      render: (val) =>
        val ? <Badge variant="success" size="sm">Featured</Badge> : <Badge variant="default" size="sm">Regular</Badge>,
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (val) => <span className="text-gray-500 text-xs">{formatDate(String(val))}</span>,
    },
    {
      key: "id",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" aria-label={`Edit ${row.name}`} onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            aria-label={`Delete ${row.name}`}
            onClick={() => setDeleteConfirm(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" description="Manage member testimonials and reviews.">
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </PageHeader>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap gap-4"
      >
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Rating</p>
          <div role="group" aria-label="Filter by rating" className="flex flex-wrap gap-1.5">
            {RATING_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                aria-pressed={ratingFilter === r}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  ratingFilter === r
                    ? "bg-accent text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white",
                )}
              >
                {r === "All" ? "All" : <><Star className="w-3 h-3 inline -mt-0.5 mr-0.5" />{r}</>}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Type</p>
          <div role="group" aria-label="Filter by featured" className="flex flex-wrap gap-1.5">
            {["All", "featured", "regular"].map((s) => (
              <button
                key={s}
                onClick={() => setFeaturedFilter(s)}
                aria-pressed={featuredFilter === s}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  featuredFilter === s
                    ? "bg-accent text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white",
                )}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-8 h-8" />}
          title="No testimonials found"
          description="Try adjusting the filters or add a new testimonial."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              Add Testimonial
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search by name…"
          pageSize={8}
          filterFn={(row, q) => row.name.toLowerCase().includes(q) || row.text.toLowerCase().includes(q)}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        description={editing ? `Editing "${editing.name}"` : "Add a new member testimonial."}
        size="lg"
      >
        <div className="space-y-4">
          <Input label="Name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Member name" />
          <Input label="Role" value={formRole} onChange={(e) => setFormRole(e.target.value)} placeholder="e.g. Member since 2023" />
          <div>
            <p className="text-sm font-medium text-gray-300 mb-1.5">Rating</p>
            <StarRatingInput value={formRating} onChange={setFormRating} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formFeatured}
              onChange={(e) => setFormFeatured(e.target.checked)}
              className="w-4 h-4 accent-accent rounded"
            />
            <label htmlFor="featured" className="text-sm text-gray-300 cursor-pointer">Featured testimonial</label>
          </div>
          <Textarea label="Testimonial" value={formText} onChange={(e) => setFormText(e.target.value)} placeholder="What they said…" rows={4} />
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
        title="Delete Testimonial"
        description={`Delete testimonial from "${deleteConfirm?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
