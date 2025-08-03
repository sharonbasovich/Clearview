import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clearview",
  description:
    "A journal app to encourage reflection and mindfulness while providing insights",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
