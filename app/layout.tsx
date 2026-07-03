import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import JsonLd from "@/components/JsonLd";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Gym 56 — Premium Fitness in Gandhinagar",
    template: "%s — Gym 56",
  },
  description:
    "Gym 56 is a premium fitness gym in Sector 26, Gandhinagar, Gujarat. Modern equipment, expert trainers, and flexible membership plans.",
  metadataBase: new URL("https://gym56.vercel.app"),
  openGraph: {
    siteName: "Gym 56",
    type: "website",
    locale: "en_IN",
    title: "Gym 56 — Premium Fitness in Gandhinagar",
    description:
      "Premium fitness gym in Sector 26, Gandhinagar. Modern equipment, expert trainers, and flexible membership plans.",
    url: "https://gym56.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gym 56 — Premium Fitness in Gandhinagar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gym 56 — Premium Fitness in Gandhinagar",
    description:
      "Premium fitness gym in Sector 26, Gandhinagar. Modern equipment, expert trainers, and flexible membership plans.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/gym56-logo.svg",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DC2626",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Gym",
  name: "Gym 56",
  description:
    "Premium fitness gym in Sector 26, Gandhinagar, Gujarat. Modern equipment, expert trainers, and flexible membership plans.",
  url: "https://gym56.vercel.app",
  telephone: "+919924441179",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, Yogi Mall, Behind D-Mart, Green City, Sector 26",
    addressLocality: "Gandhinagar",
    addressRegion: "Gujarat",
    postalCode: "382028",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.2156,
    longitude: 72.6369,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "05:30", closes: "22:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "05:30", closes: "22:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "05:30", closes: "22:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "05:30", closes: "22:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "05:30", closes: "22:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "05:30", closes: "22:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "07:00", closes: "12:00" },
  ],
  priceRange: "₹1,500 - ₹9,000",
  image: "https://gym56.vercel.app/og-image.png",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Gym 56",
  url: "https://gym56.vercel.app",
  logo: "https://gym56.vercel.app/gym56-logo.svg",
  sameAs: [
    "https://maps.app.goo.gl/your-gym-location",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <JsonLd data={localBusinessSchema} />
        <JsonLd data={organizationSchema} />
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTop />
        </AuthProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
