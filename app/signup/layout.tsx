import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Gym 56",
  description: "Join Gym 56 — Gandhinagar's premium fitness destination. Start your fitness journey today.",
  openGraph: {
    title: "Sign Up — Gym 56",
    description: "Join Gym 56 — Gandhinagar's premium fitness destination. Start your fitness journey today.",
    url: "https://gym56.vercel.app/signup",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
