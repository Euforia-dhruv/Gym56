import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Gym 56",
  description: "Sign in to your Gym 56 account to track workouts, view progress, and more.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
