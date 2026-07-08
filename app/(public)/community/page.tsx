import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import CommunityHub from "@/components/community/CommunityHub";

export const metadata: Metadata = {
  title: "Community - Gym 56",
  description:
    "Connect with Gym 56 members, share your fitness journey, join challenges, earn badges, and get inspired by real transformations.",
  openGraph: {
    title: "Community — Gym 56",
    description: "Join the Gym 56 community. Share stories, track achievements, and connect with fellow fitness enthusiasts.",
    url: "https://gym56.vercel.app/community",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community — Gym 56",
    description: "Join the Gym 56 community. Share stories, track achievements, and connect with fellow fitness enthusiasts.",
  },
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ToastProvider>
          <CommunityHub />
        </ToastProvider>
      </div>
    </div>
  );
}
