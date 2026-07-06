import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Gym 56",
  description: "Sign in to your Gym 56 account to access your member dashboard, track workouts, manage membership, and more.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
