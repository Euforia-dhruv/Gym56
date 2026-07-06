import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getMyProfile, getMySubscriptions } from "@/lib/actions/member-profile";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "Dashboard - Gym 56",
  description: "Your Gym 56 member dashboard — track workouts, weight, goals, achievements, and more.",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  let profile;
  let subscriptions;

  try {
    [profile, subscriptions] = await Promise.all([
      getMyProfile(),
      getMySubscriptions(),
    ]);
  } catch {
    redirect("/login?redirectTo=/dashboard");
  }

  const activeSubscription = subscriptions?.find(
    (s) =>
      s.payment_status === "paid" &&
      new Date(s.expires_at) >= new Date()
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <DashboardOverview
          user={{ id: user.id, email: user.email }}
          profile={profile}
          subscription={activeSubscription ?? null}
        />
      </div>
    </div>
  );
}
