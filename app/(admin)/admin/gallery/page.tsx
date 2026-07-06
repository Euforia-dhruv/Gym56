"use client";

import * as React from "react";
import {
  Plus,
  Images,
  Trash2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const STORAGE_KEY = "gym56_gallery";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  date: string;
}

const CATEGORIES = ["All", "Facility", "Equipment", "Classes", "Events", "Members"];

const GRADIENT_PLACEHOLDERS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
];

function seedGallery(): GalleryItem[] {
  const now = new Date();
  const titles = [
    "Main Gym Floor",
    "Cardio Zone",
    "Free Weights Area",
    "Yoga Studio",
    "Group Class Session",
    "Locker Room",
    "Personal Training",
    "Supplement Store",
  ];
  const categories = ["Facility", "Equipment", "Equipment", "Classes", "Classes", "Facility", "Members", "Facility"];
  const descriptions = [
    "Our spacious main gym floor with state-of-the-art equipment.",
    "Dedicated cardio zone with treadmills, cycles, and rowing machines.",
    "Fully stocked free weights area with dumbbells up to 50 kg.",
    "Serene yoga studio for group classes and personal practice.",
    "Energetic group class session with our certified instructors.",
    "Clean and modern locker room facilities with showers and lockers.",
    "One-on-one personal training sessions with experienced trainers.",
    "Well-stocked supplement store for all your fitness nutrition needs.",
  ];

  return titles.map((title, i) => ({
    id: String(i + 1),
    title,
    image: GRADIENT_PLACEHOLDERS[i],
    category: categories[i],
    description: descriptions[i],
    date: new Date(now.getTime() - 86400000 * i * 3).toISOString(),
  }));
}

function loadGallery(): GalleryItem[] {
  if (typeof window === "undefined") return seedGallery();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as GalleryItem[];
    } catch {
      // fall through
    }
  }
  const data = seedGallery();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveGallery(items: GalleryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function GalleryPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [category, setCategory] = React.useState("All");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<GalleryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Form
  const [formTitle, setFormTitle] = React.useState("");
  const [formImage, setFormImage] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("Facility");
  const [formDescription, setFormDescription] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    setItems(loadGallery());
    setLoading(false);
  }, []);

  const filtered = category === "All" ? items : items.filter((i) => i.category === category);

  const openCreate = () => {
    setEditing(null);
    setFormTitle("");
    setFormImage("");
    setFormCategory("Facility");
    setFormDescription("");
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setFormTitle(item.title);
    setFormImage(item.image);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setFormImage(dataUrl);
    } catch {
      toast({ title: "Failed to read file", variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      toast({ title: "Title is required", variant: "error" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    try {
      if (editing) {
        const updated: GalleryItem = {
          ...editing,
          title: formTitle.trim(),
          image: formImage,
          category: formCategory,
          description: formDescription.trim(),
        };
        const next = items.map((i) => (i.id === editing.id ? updated : i));
        setItems(next);
        saveGallery(next);
        toast({ title: "Gallery item updated", variant: "success" });
      } else {
        const created: GalleryItem = {
          id: generateId(),
          title: formTitle.trim(),
          image: formImage || GRADIENT_PLACEHOLDERS[items.length % GRADIENT_PLACEHOLDERS.length],
          category: formCategory,
          description: formDescription.trim(),
          date: new Date().toISOString(),
        };
        const next = [created, ...items];
        setItems(next);
        saveGallery(next);
        toast({ title: "Gallery item created", variant: "success" });
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
    const next = items.filter((i) => i.id !== deleteConfirm.id);
    setItems(next);
    saveGallery(next);
    setDeleting(false);
    setDeleteConfirm(null);
    toast({ title: "Gallery item deleted", variant: "success" });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Gallery" description="Manage gym gallery images.">
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </PageHeader>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                category === cat
                  ? "bg-accent text-white"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Images className="w-8 h-8" />}
          title="No images found"
          description="Try a different category or add new images."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              Add Image
            </Button>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="group relative glass rounded-2xl overflow-hidden"
            >
              <div
                className="w-full h-48 flex items-center justify-center"
                style={{
                  background: item.image.startsWith("linear-gradient") ? item.image : undefined,
                }}
              >
                {item.image.startsWith("data:") || item.image.startsWith("http") ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Images className="w-12 h-12 text-white/40" />
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                )}
                <p className="text-xs text-gray-600 mt-2">{formatDate(item.date)}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                  aria-label={`Edit ${item.title}`}
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(item)}
                  className="p-2 rounded-lg bg-red-600/60 hover:bg-red-600/80 text-white transition-colors"
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? "Edit Gallery Item" : "Add Gallery Item"}
        description={editing ? `Editing "${editing.title}"` : "Add a new image to the gallery."}
        size="md"
      >
        <div className="space-y-4">
          <Input label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Image title" />
          <Select
            label="Category"
            options={CATEGORIES.filter((c) => c !== "All").map((c) => ({ value: c, label: c }))}
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value)}
          />
          <Textarea label="Description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Optional description…" rows={3} />

          <div>
            <p className="text-sm font-medium text-gray-300 mb-1.5">Image</p>
            {formImage ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: formImage.startsWith("linear-gradient") ? formImage : undefined }}
                >
                  {(formImage.startsWith("data:") || formImage.startsWith("http")) && (
                    <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
                <button
                  onClick={() => setFormImage("")}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-white/10 hover:border-accent/40 hover:bg-accent/5 cursor-pointer transition-colors">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

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
        title="Delete Image"
        description={`Delete "${deleteConfirm?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
