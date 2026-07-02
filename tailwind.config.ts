import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          DEFAULT: "#DC2626",
          hover: "#B91C1C",
          light: "rgba(220,38,38,0.1)",
          glow: "rgba(220,38,38,0.3)",
        },
        glass: {
          DEFAULT: "rgba(10,10,10,0.6)",
          border: "rgba(255,255,255,0.1)",
          hover: "rgba(255,255,255,0.05)",
        },
        admin: {
          sidebar: "#0d0d0d",
          surface: "#111111",
          elevated: "#161616",
          border: "rgba(255,255,255,0.08)",
          muted: "#6b7280",
        },
      },
      boxShadow: {
        accent: "0 0 20px rgba(220,38,38,0.3)",
        "accent-sm": "0 0 10px rgba(220,38,38,0.2)",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
        card: "0 4px 16px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
