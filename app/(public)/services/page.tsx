import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Our Services - Gym 56",
  description:
    "Discover the premium fitness services offered at Gym 56 in Gandhinagar — personal training, group classes, modern equipment, and more.",
  openGraph: {
    title: "Our Services — Gym 56",
    description:
      "Discover the premium fitness services offered at Gym 56 in Gandhinagar.",
    url: "https://gym56.vercel.app/services",
  },
};

export default function Services() {
  return <ServicesClient />;
}
