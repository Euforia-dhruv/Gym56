import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getMyProfile, getMySubscriptions } from "@/lib/actions/member-profile";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  User,
  CreditCard,
  Calendar,
  Shield,
  ChevronRight,
  Dumbbell,
} from "lucide-react";

export const metadata = {
  title: "Dashboard - Gym 56",
  description: "Your Gym 56 member dashboard.",
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-[#DC2626]">
              {profile?.full_name || user.email?.split("@")[0] || "Member"}
            </span>
          </h1>
          <p className="text-gray-400">Your fitness journey at Gym 56</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Active Membership */}
          <div className="glass rounded-2xl p-6 hover:border-[#DC2626]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#DC2626]" />
              </div>
              <h2 className="font-bold text-white">Membership</h2>
            </div>
            {activeSubscription ? (
              <div>
                <p className="text-2xl font-black text-white mb-1">
                  {activeSubscription.plan?.name || "Active"}
                </p>
                <p className="text-sm text-gray-400">
                  Expires {formatDate(activeSubscription.expires_at)}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-sm mb-3">No active membership</p>
                <Link
                  href="/#membership"
                  className="inline-flex items-center gap-1 text-[#DC2626] text-sm font-semibold hover:text-white transition-colors"
                >
                  View Plans <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="glass rounded-2xl p-6 hover:border-[#DC2626]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center">
                <User className="w-5 h-5 text-[#DC2626]" />
              </div>
              <h2 className="font-bold text-white">Profile</h2>
            </div>
            <p className="text-lg font-semibold text-white mb-1">
              {profile?.full_name || "Set your name"}
            </p>
            <p className="text-sm text-gray-400">{user.email}</p>
            {profile?.phone && (
              <p className="text-sm text-gray-500 mt-1">{profile.phone}</p>
            )}
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1 text-[#DC2626] text-sm font-semibold hover:text-white transition-colors mt-3"
            >
              Edit Profile <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Member Since */}
          <div className="glass rounded-2xl p-6 hover:border-[#DC2626]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#DC2626]" />
              </div>
              <h2 className="font-bold text-white">Member Since</h2>
            </div>
            <p className="text-2xl font-black text-white">
              {profile?.created_at
                ? formatDate(profile.created_at)
                : "Today"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {profile?.role
                ? `Role: ${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}`
                : "Member"}
            </p>
          </div>
        </div>

        {/* Recent Subscriptions */}
        {subscriptions && subscriptions.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              Subscription History
            </h2>
            <div className="space-y-3">
              {subscriptions.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/8"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {sub.plan?.name || "Unknown Plan"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(sub.starts_at)} – {formatDate(sub.expires_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      {sub.amount_paid_minor
                        ? formatCurrency(sub.amount_paid_minor)
                        : "—"}
                    </p>
                    <span
                      className={`text-xs font-semibold ${
                        sub.payment_status === "paid"
                          ? "text-green-400"
                          : sub.payment_status === "pending"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {sub.payment_status.charAt(0).toUpperCase() +
                        sub.payment_status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/exercises"
            className="glass rounded-2xl p-6 hover:border-[#DC2626]/30 transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
              <Dumbbell className="w-6 h-6 text-[#DC2626]" />
            </div>
            <div>
              <p className="font-bold text-white">Exercise Library</p>
              <p className="text-sm text-gray-400">
                Browse exercises with instructions
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 ml-auto" />
          </Link>

          <Link
            href="/equipment"
            className="glass rounded-2xl p-6 hover:border-[#DC2626]/30 transition-all duration-300 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[#DC2626]" />
            </div>
            <div>
              <p className="font-bold text-white">Gym Equipment</p>
              <p className="text-sm text-gray-400">
                View all available equipment
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
}
