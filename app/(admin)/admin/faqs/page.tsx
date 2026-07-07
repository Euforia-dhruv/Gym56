"use client";

import * as React from "react";
import {
  Plus,
  HelpCircle,
  ChevronUp,
  ChevronDown,
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
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const STORAGE_KEY = "gym56_faqs";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

const CATEGORIES = ["All", "Pricing", "Facilities", "Timing", "Classes", "Personal Training", "Nutrition", "General"];

function seedFAQs(): FAQ[] {
  return [
    { id: "1", question: "What are your opening hours?", answer: "We are open Monday to Saturday from 6:00 AM to 10:00 PM, and Sunday from 8:00 AM to 6:00 PM.", category: "Timing", order: 1, published: true },
    { id: "2", question: "How much does it cost to join?", answer: "We offer flexible pricing options starting from ₹1,999/month. Contact us on WhatsApp for detailed pricing and offers.", category: "Pricing", order: 2, published: true },
    { id: "3", question: "Do you offer trial sessions?", answer: "Yes! We offer a free trial session for all new visitors. You can book your trial through WhatsApp or visit our front desk.", category: "Pricing", order: 3, published: true },
    { id: "4", question: "What equipment do you have?", answer: "We have a wide range of equipment including treadmills, cycles, dumbbells, bench presses, cable machines, leg press, and more.", category: "Facilities", order: 4, published: true },
    { id: "5", question: "Do you offer personal training?", answer: "Absolutely! Our certified personal trainers offer one-on-one sessions tailored to your fitness goals. Contact us on WhatsApp for pricing.", category: "Personal Training", order: 5, published: true },
    { id: "6", question: "What group classes do you offer?", answer: "We offer Yoga, Zumba, HIIT, Boxing, Pilates, and Spin classes. Check our schedule for timings and availability.", category: "Classes", order: 6, published: true },
    { id: "7", question: "Is there parking available?", answer: "Yes, we have ample parking space for both two-wheelers and four-wheelers.", category: "Facilities", order: 7, published: true },
    { id: "8", question: "Can I pause my plan?", answer: "Yes, you can pause your plan for up to 30 days per year. Contact our support team for assistance.", category: "Pricing", order: 8, published: false },
  ];
}

function loadFAQs(): FAQ[] {
  if (typeof window === "undefined") return seedFAQs();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as FAQ[];
    } catch {
      // fall through
    }
  }
  const data = seedFAQs();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveFAQs(data: FAQ[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export default function FAQsPage() {
  const { toast } = useToast();
  const [faqs, setFaqs] = React.useState<FAQ[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [category, setCategory] = React.useState("All");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FAQ | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<FAQ | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // Form
  const [formQuestion, setFormQuestion] = React.useState("");
  const [formAnswer, setFormAnswer] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("General");
  const [formPublished, setFormPublished] = React.useState(true);

  React.useEffect(() => {
    setFaqs(loadFAQs().sort((a, b) => a.order - b.order));
    setLoading(false);
  }, []);

  const filtered = category === "All" ? faqs : faqs.filter((f) => f.category === category);

  const moveUp = (faq: FAQ) => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((f) => f.id === faq.id);
    if (idx <= 0) return;
    const prev = sorted[idx - 1];
    const next = sorted.map((f) => {
      if (f.id === faq.id) return { ...f, order: prev.order };
      if (f.id === prev.id) return { ...f, order: faq.order };
      return f;
    });
    setFaqs(next);
    saveFAQs(next);
  };

  const moveDown = (faq: FAQ) => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((f) => f.id === faq.id);
    if (idx >= sorted.length - 1) return;
    const nextItem = sorted[idx + 1];
    const next = sorted.map((f) => {
      if (f.id === faq.id) return { ...f, order: nextItem.order };
      if (f.id === nextItem.id) return { ...f, order: faq.order };
      return f;
    });
    setFaqs(next);
    saveFAQs(next);
  };

  const openCreate = () => {
    setEditing(null);
    setFormQuestion("");
    setFormAnswer("");
    setFormCategory("General");
    setFormPublished(true);
    setModalOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditing(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category);
    setFormPublished(faq.published);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formQuestion.trim() || !formAnswer.trim()) {
      toast({ title: "Question and answer are required", variant: "error" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    try {
      if (editing) {
        const updated: FAQ = { ...editing, question: formQuestion.trim(), answer: formAnswer.trim(), category: formCategory, published: formPublished };
        const next = faqs.map((f) => (f.id === editing.id ? updated : f));
        setFaqs(next);
        saveFAQs(next);
        toast({ title: "FAQ updated", variant: "success" });
      } else {
        const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.order)) : 0;
        const created: FAQ = {
          id: generateId(),
          question: formQuestion.trim(),
          answer: formAnswer.trim(),
          category: formCategory,
          order: maxOrder + 1,
          published: formPublished,
        };
        const next = [...faqs, created];
        setFaqs(next);
        saveFAQs(next);
        toast({ title: "FAQ created", variant: "success" });
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
    const next = faqs.filter((f) => f.id !== deleteConfirm.id);
    setFaqs(next);
    saveFAQs(next);
    setDeleting(false);
    setDeleteConfirm(null);
    toast({ title: "FAQ deleted", variant: "success" });
  };

  const columns: Column<FAQ>[] = [
    {
      key: "order",
      header: "#",
      sortable: true,
      render: (val) => <span className="text-gray-500 text-xs font-mono">{String(val)}</span>,
    },
    {
      key: "question",
      header: "Question",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <HelpCircle className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="font-semibold text-white text-sm">{row.question}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (val) => <Badge variant="outline" size="sm">{String(val)}</Badge>,
    },
    {
      key: "published",
      header: "Published",
      sortable: true,
      render: (val) =>
        val ? <Badge variant="success" size="sm">Published</Badge> : <Badge variant="warning" size="sm">Draft</Badge>,
    },
    {
      key: "id",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => moveUp(row)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => moveDown(row)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <Button size="sm" variant="ghost" aria-label={`Edit ${row.question}`} onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            aria-label={`Delete ${row.question}`}
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
      <PageHeader title="FAQs" description="Manage frequently asked questions.">
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add FAQ
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
          icon={<HelpCircle className="w-8 h-8" />}
          title="No FAQs found"
          description="Try a different category or add new FAQs."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              Add FAQ
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          searchPlaceholder="Search FAQs…"
          pageSize={10}
          filterFn={(row, q) => row.question.toLowerCase().includes(q) || row.answer.toLowerCase().includes(q)}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? "Edit FAQ" : "Add FAQ"}
        description={editing ? `Editing "${editing.question}"` : "Create a new frequently asked question."}
        size="lg"
      >
        <div className="space-y-4">
          <Input label="Question" value={formQuestion} onChange={(e) => setFormQuestion(e.target.value)} placeholder="Enter the question…" />
          <Select
            label="Category"
            options={CATEGORIES.filter((c) => c !== "All").map((c) => ({ value: c, label: c }))}
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formPublished}
              onChange={(e) => setFormPublished(e.target.checked)}
              className="w-4 h-4 accent-accent rounded"
            />
            <label htmlFor="published" className="text-sm text-gray-300 cursor-pointer">Published</label>
          </div>
          <Textarea label="Answer" value={formAnswer} onChange={(e) => setFormAnswer(e.target.value)} placeholder="Enter the answer…" rows={5} />
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
        title="Delete FAQ"
        description={`Delete "${deleteConfirm?.question}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
