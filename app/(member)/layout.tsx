import React from "react";
import { ToastProvider } from "@/components/ui/Toast";

export default function MemberGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
