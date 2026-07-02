import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  // Fallback title used by pages that do not export their own metadata.
  // Pages with their own metadata export will override this entirely.
  title: {
    default: "Gym 56 — Premium Fitness in Gandhinagar",
    // %s is replaced by each page's own title string
    template: "%s — Gym 56",
  },
  description:
    "Gym 56 is a premium fitness gym in Sector 26, Gandhinagar, Gujarat. Modern equipment, expert trainers, and flexible membership plans.",
  metadataBase: new URL("https://gym56.vercel.app"),
  openGraph: {
    siteName: "Gym 56",
    type: "website",
    locale: "en_IN",
  },
};

// Explicit viewport export — gives control over theme colour and avoids
// the Next.js 15 deprecation warning for viewport inside metadata.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DC2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
