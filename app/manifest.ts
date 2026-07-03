import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gym 56 — Premium Fitness in Gandhinagar",
    short_name: "Gym 56",
    description:
      "Premium fitness gym in Sector 26, Gandhinagar, Gujarat. Modern equipment, expert trainers, and flexible membership plans.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#DC2626",
    icons: [
      { src: "/gym56-logo.png", sizes: "1024x1024", type: "image/png" },
      { src: "/gym56-logo.png", sizes: "1024x1024", type: "image/png", purpose: "maskable" },
    ],
  };
}
