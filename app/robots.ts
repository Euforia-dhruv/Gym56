import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/login", "/signup", "/forgot-password", "/reset-password"],
    },
    sitemap: "https://gym56.vercel.app/sitemap.xml",
  };
}
