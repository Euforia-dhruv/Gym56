"use client";

import { Users, Dumbbell, FileText, MessageSquare, Activity } from "lucide-react";

interface Props {
  user: { id: string; email?: string };
  role: string;
}

const cards = [
  {
    icon: Dumbbell,
    label: "Equipment",
    desc: "Manage gym equipment inventory",
    color: "bg-blue-500/10 text-blue-400",
    href: "/admin/equipment",
  },
  {
    icon: FileText,
    label: "Exercises",
    desc: "Manage exercise library",
    color: "bg-green-500/10 text-green-400",
    href: "/admin/exercises",
  },
  {
    icon: MessageSquare,
    label: "Contact Messages",
    desc: "View member inquiries",
    color: "bg-purple-500/10 text-purple-400",
    href: "/admin/contacts",
  },
  {
    icon: Users,
    label: "Members",
    desc: "View member profiles",
    color: "bg-amber-500/10 text-amber-400",
    href: "/admin/members",
  },
  {
    icon: Activity,
    label: "Site Stats",
    desc: "Overview of site metrics",
    color: "bg-rose-500/10 text-rose-400",
    href: "/admin/stats",
  },
];

export default function AdminOverview({ user, role }: Props) {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-2">
            Signed in as <span className="text-white font-medium">{user.email}</span> ({role})
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-[#DC2626] transition-colors">
                {card.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/equipment?action=new"
              className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add Equipment
            </a>
            <a
              href="/admin/exercises?action=new"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add Exercise
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}