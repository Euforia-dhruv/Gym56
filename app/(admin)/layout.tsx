import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

// The (admin) route group shares the AdminLayout shell (sidebar + header).
// Route protection (admin role check via JWT claim) will be enforced in
// Sprint 2A when the Supabase SSR client is integrated into middleware.
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
