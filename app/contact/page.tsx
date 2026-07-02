import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Gym 56. Visit us in Sector 26, Gandhinagar, Gujarat, or reach us by phone and email.",
  openGraph: {
    title: "Contact Us — Gym 56",
    description:
      "Get in touch with Gym 56. Visit us in Sector 26, Gandhinagar, Gujarat.",
    url: "https://gym56.vercel.app/contact",
  },
};

export default function Contact() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-center">Contact Us</h1>
    </div>
  );
}
