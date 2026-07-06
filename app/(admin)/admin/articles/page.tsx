"use client";

import * as React from "react";
import {
  Plus,
  FileText,
  Calendar,
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
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Column } from "@/components/ui/Table";
import { cn, slugify, formatDate, truncate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const STORAGE_KEY = "gym56_articles";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  published: boolean;
  date: string;
}

const CATEGORIES = ["All", "Fitness", "Nutrition", "Wellness", "Training", "Lifestyle", "Recovery"];

function seedArticles(): Article[] {
  const now = new Date();
  return [
    {
      id: "1",
      title: "10 Essential Exercises for Beginners",
      slug: "10-essential-exercises-for-beginners",
      content: "Starting your fitness journey can be overwhelming. Here are 10 essential exercises every beginner should master to build a strong foundation...",
      excerpt: "Start your fitness journey with these 10 fundamental exercises.",
      author: "Priya Sharma",
      category: "Fitness",
      tags: ["beginners", "exercises", "workout"],
      image: "",
      published: true,
      date: new Date(now.getTime() - 86400000 * 2).toISOString(),
    },
    {
      id: "2",
      title: "The Ultimate Guide to Post-Workout Nutrition",
      slug: "ultimate-guide-post-workout-nutrition",
      content: "What you eat after a workout is crucial for recovery and muscle growth. Learn about the best post-workout meals and supplements...",
      excerpt: "Optimise your recovery with the right post-workout nutrition.",
      author: "Dr. Amit Patel",
      category: "Nutrition",
      tags: ["nutrition", "recovery", "protein"],
      image: "",
      published: true,
      date: new Date(now.getTime() - 86400000 * 5).toISOString(),
    },
    {
      id: "3",
      title: "Mindfulness and Meditation for Athletes",
      slug: "mindfulness-meditation-athletes",
      content: "Mental training is just as important as physical training. Discover how mindfulness and meditation can improve your athletic performance...",
      excerpt: "Enhance your performance through mindfulness practices.",
      author: "Neha Gupta",
      category: "Wellness",
      tags: ["mindfulness", "meditation", "mental-health"],
      image: "",
      published: true,
      date: new Date(now.getTime() - 86400000 * 8).toISOString(),
    },
    {
      id: "4",
      title: "5 Advanced Training Techniques for Muscle Growth",
      slug: "5-advanced-training-techniques-muscle-growth",
      content: "Plateaued? Try these five advanced training techniques used by professional bodybuilders to break through sticking points...",
      excerpt: "Break through plateaus with advanced training methods.",
      author: "Rahul Verma",
      category: "Training",
      tags: ["advanced", "muscle-growth", "hypertrophy"],
      image: "",
      published: false,
      date: new Date(now.getTime() - 86400000 * 12).toISOString(),
    },
    {
      id: "5",
      title: "Healthy Meal Prep Ideas for the Week",
      slug: "healthy-meal-prep-ideas-week",
      content: "Save time and stay on track with these healthy meal prep ideas. From breakfast to dinner, we've got you covered...",
      excerpt: "Plan your meals ahead with these nutritious and delicious ideas.",
      author: "Dr. Amit Patel",
      category: "Nutrition",
      tags: ["meal-prep", "healthy-eating", "recipes"],
      image: "",
      published: true,
      date: new Date(now.getTime() - 86400000 * 15).toISOString(),
    },
    {
      id: "6",
      title: "The Importance of Recovery Days",
      slug: "importance-recovery-days",
      content: "Rest days are not a sign of weakness. Learn why recovery is essential for muscle repair, injury prevention, and long-term progress...",
      excerpt: "Why rest days are crucial for your fitness progress.",
      author: "Priya Sharma",
      category: "Recovery",
      tags: ["recovery", "rest", "injury-prevention"],
      image: "",
      published: true,
      date: new Date(now.getTime() - 86400000 * 20).toISOString(),
    },
  ];
}

function loadArticles(): Article[] {
  if (typeof window === "undefined") return seedArticles();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Article[];
    } catch {
      // fall through
    }
  }
  const data = seedArticles();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveArticles(articles: Article[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export default function ArticlesPage() {
  const { toast } = useToast();
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [category, setCategory] = React.useState("All");
  const [publishedFilter, setPublishedFilter] = React.useState("All");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Article | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Article | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Form state
  const [formTitle, setFormTitle] = React.useState("");
  const [formContent, setFormContent] = React.useState("");
  const [formExcerpt, setFormExcerpt] = React.useState("");
  const [formAuthor, setFormAuthor] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("");
  const [formTags, setFormTags] = React.useState("");
  const [formImage, setFormImage] = React.useState("");
  const [formPublished, setFormPublished] = React.useState(false);

  React.useEffect(() => {
    setArticles(loadArticles());
    setLoading(false);
  }, []);

  const filtered = articles.filter((a) => {
    const catMatch = category === "All" || a.category === category;
    const pubMatch =
      publishedFilter === "All" ||
      (publishedFilter === "published" && a.published) ||
      (publishedFilter === "draft" && !a.published);
    return catMatch && pubMatch;
  });

  const openCreate = () => {
    setEditing(null);
    setFormTitle("");
    setFormContent("");
    setFormExcerpt("");
    setFormAuthor("");
    setFormCategory("Fitness");
    setFormTags("");
    setFormImage("");
    setFormPublished(true);
    setModalOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditing(article);
    setFormTitle(article.title);
    setFormContent(article.content);
    setFormExcerpt(article.excerpt);
    setFormAuthor(article.author);
    setFormCategory(article.category);
    setFormTags(article.tags.join(", "));
    setFormImage(article.image);
    setFormPublished(article.published);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast({ title: "Title and content are required", variant: "error" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    try {
      if (editing) {
        const updated: Article = {
          ...editing,
          title: formTitle.trim(),
          slug: slugify(formTitle.trim()),
          content: formContent.trim(),
          excerpt: formExcerpt.trim(),
          author: formAuthor.trim(),
          category: formCategory,
          tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
          image: formImage.trim(),
          published: formPublished,
        };
        const next = articles.map((a) => (a.id === editing.id ? updated : a));
        setArticles(next);
        saveArticles(next);
        toast({ title: "Article updated", variant: "success" });
      } else {
        const created: Article = {
          id: generateId(),
          title: formTitle.trim(),
          slug: slugify(formTitle.trim()),
          content: formContent.trim(),
          excerpt: formExcerpt.trim(),
          author: formAuthor.trim(),
          category: formCategory,
          tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
          image: formImage.trim(),
          published: formPublished,
          date: new Date().toISOString(),
        };
        const next = [created, ...articles];
        setArticles(next);
        saveArticles(next);
        toast({ title: "Article created", variant: "success" });
      }
      setModalOpen(false);
    } catch {
      toast({ title: "Error saving article", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 300));
    const next = articles.filter((a) => a.id !== deleteConfirm.id);
    setArticles(next);
    saveArticles(next);
    setDeleting(false);
    setDeleteConfirm(null);
    toast({ title: "Article deleted", variant: "success" });
  };

  const columns: Column<Article>[] = [
    {
      key: "title",
      header: "Article",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{row.title}</p>
            <p className="text-xs text-gray-500">{truncate(row.excerpt, 60)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (val) => <span className="text-gray-400 text-sm">{val ? String(val) : "—"}</span>,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (val) => <Badge variant="outline" size="sm">{String(val)}</Badge>,
    },
    {
      key: "published",
      header: "Status",
      sortable: true,
      render: (val) =>
        val ? (
          <Badge variant="success" size="sm">Published</Badge>
        ) : (
          <Badge variant="warning" size="sm">Draft</Badge>
        ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (val) => (
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(String(val))}
        </span>
      ),
    },
    {
      key: "id",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" aria-label={`Edit ${row.title}`} onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            aria-label={`Delete ${row.title}`}
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
      <PageHeader title="Articles" description="Manage blog posts and articles.">
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Article
        </Button>
      </PageHeader>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap gap-4"
      >
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Category</p>
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
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
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Status</p>
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {["All", "published", "draft"].map((s) => (
              <button
                key={s}
                onClick={() => setPublishedFilter(s)}
                aria-pressed={publishedFilter === s}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  publishedFilter === s
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
          icon={<FileText className="w-8 h-8" />}
          title="No articles found"
          description="Try adjusting the filters or add a new article."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              Add Article
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search articles…"
          pageSize={8}
          filterFn={(row, q) =>
            row.title.toLowerCase().includes(q) ||
            row.author.toLowerCase().includes(q) ||
            row.excerpt.toLowerCase().includes(q)
          }
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Article" : "Add Article"}
        description={editing ? `Editing "${editing.title}"` : "Create a new blog post or article."}
        size="xl"
      >
        <div className="space-y-4">
          <Input label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Article title" />
          <Input label="Author" value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} placeholder="Author name" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={CATEGORIES.filter((c) => c !== "All").map((c) => ({ value: c, label: c }))}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            />
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="w-4 h-4 accent-accent rounded"
                />
                <span className="text-sm text-gray-300">Published</span>
              </label>
            </div>
          </div>
          <Input label="Tags (comma separated)" value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="fitness, nutrition, tips" />
          <Input label="Image URL (optional)" value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="https://example.com/image.jpg" />
          <Textarea label="Excerpt" value={formExcerpt} onChange={(e) => setFormExcerpt(e.target.value)} placeholder="Brief summary…" rows={2} />
          <Textarea label="Content" value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="Article content…" rows={6} />
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
        title="Delete Article"
        description={`Delete "${deleteConfirm?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
