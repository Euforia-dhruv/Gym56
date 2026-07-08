import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password - Gym 56",
  description: "Reset your Gym 56 account password. Enter your email and we'll send you a password reset link.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
