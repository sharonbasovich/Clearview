import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wellbeing Journal - Your Personal Wellness Companion",
  description:
    "Track your thoughts, emotions, and personal growth in a safe, private space designed for your mental wellness.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
