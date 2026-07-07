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
    "Gym 56 is a premium fitness gym in Sector 26, Gandhinagar, Gujarat. Modern equipment, expert trainers, and top-notch facilities.",
  metadataBase: new URL("https://gym56.vercel.app"),
  openGraph: {
    siteName: "Gym 56",
    type: "website",
    locale: "en_IN",
    title: "Gym 56 — Premium Fitness in Gandhinagar",
    description:
      "Premium fitness gym in Sector 26, Gandhinagar. Modern equipment, expert trainers, and top-notch facilities.",
    url: "https://gym56.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gym 56 — Premium Fitness in Gandhinagar",
    description:
      "Premium fitness gym in Sector 26, Gandhinagar. Modern equipment, expert trainers, and top-notch facilities.",
  },
  icons: {
    icon: "/gym56-logo.png",
    apple: "/gym56-logo.png",
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
    "Premium fitness gym in Sector 26, Gandhinagar, Gujarat. Modern equipment, expert trainers, and top-notch facilities.",
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
    latitude: 23.2553,
    longitude: 72.6342,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "06:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "06:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "06:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "06:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "06:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "06:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "00:00", closes: "00:00" },
  ],
  priceRange: "₹1,500 - ₹9,000",
  image: "https://gym56.vercel.app/gym56-logo.png",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Gym 56",
  url: "https://gym56.vercel.app",
  logo: "https://gym56.vercel.app/gym56-logo.png",
  sameAs: [
    "https://maps.app.goo.gl/Y4VNHVrCJjX1HCUx6",
    "https://www.instagram.com/gym56_gandhinagar",
    "https://jsdl.in/DT-99GFBNQ1Y5B",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gym 56",
  url: "https://gym56.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://gym56.vercel.app/exercises?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://gym56.vercel.app" },
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
        <JsonLd data={websiteSchema} />
        <JsonLd data={breadcrumbSchema} />
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
