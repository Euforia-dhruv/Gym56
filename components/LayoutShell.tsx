"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

function isPublicRoute(pathname: string): boolean {
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    return false;
  }
  return true;
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = isPublicRoute(pathname);

  if (!isPublic) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
