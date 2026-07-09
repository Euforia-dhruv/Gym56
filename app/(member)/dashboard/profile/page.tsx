"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { ProfileUpdateSchema } from "@/types/api";
import type { Profile } from "@/types";

type ProfileWithEmail = Profile & { email?: string };

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createSupabaseBrowserClient();

  const [profile, setProfile] = useState<ProfileWithEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login?redirectTo=/dashboard/profile");
        return;
      }
      return supabase
        .from("profiles")
.select("*")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            toast({ title: "Error", description: "Failed to load profile", variant: "error" });
            return;
          }
          setProfile(data);
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
        });
    }).catch(() => router.push("/login?redirectTo=/dashboard/profile"))
      .finally(() => setLoading(false));
  }, [router, supabase]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsed = ProfileUpdateSchema.parse({ full_name: fullName.trim() || undefined, phone: phone.trim() || undefined });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      await supabase
        .from("profiles")
        .update(parsed)
        .eq("id", user.id);
      toast({ title: "Profile updated!", variant: "success" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (formData: FormData) => {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    // Server-side MIME validation from magic bytes
    const buffer = await file.arrayBuffer();
    const header = new Uint8Array(buffer.slice(0, 8));
    const hex = Array.from(header).map((b) => b.toString(16).padStart(2, "0")).join("");
    let ext: string;
    if (hex.startsWith("ffd8ff")) ext = "jpeg";
    else if (hex.startsWith("89504e47")) ext = "png";
    else if (hex.startsWith("52494646") || hex.startsWith("0000001c66747970") || hex.startsWith("0000001866747970")) ext = "webp";
    else throw new Error("Invalid file type. Accepted: JPEG, PNG, WebP");

    if (file.size > 2 * 1024 * 1024) throw new Error("File too large. Max 2 MB");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const path = `avatars/${user.id}.${ext}`;
    await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    return { publicUrl };
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Your <span className="text-[#DC2626]">Profile</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Manage your personal information and settings
          </p>

          <div className="glass rounded-2xl p-8 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile?.full_name || "Profile"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="w-8 h-8 text-[#DC2626]" />
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-white">
                  {profile?.full_name || "Member"}
                </p>
                <p className="text-sm text-gray-400">{profile?.email || "..."}</p>
              </div>
            </div>

            {/* Image upload */}
            <ImageUploader
              currentImage={profile?.avatar_url}
              onUpload={handleImageUpload}
              altText="Profile avatar"
              accept="image/jpeg,image/png,image/webp"
              maxSize={2 * 1024 * 1024}
            />

            {/* Form fields */}
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              type="tel"
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
              <Button
                size="sm"
                loading={saving}
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
