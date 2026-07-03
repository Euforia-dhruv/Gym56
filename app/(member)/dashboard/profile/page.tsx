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
import {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
} from "@/lib/actions/member-profile";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
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
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
      })
      .catch(() => router.push("/login?redirectTo=/dashboard/profile"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile({
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      toast({ title: "Profile updated!", variant: "success" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (formData: FormData) => {
    return uploadMyAvatar(formData);
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
