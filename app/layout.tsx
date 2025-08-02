import "./globals.css";
import { Inter } from "next/font/google";
import { MUIThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NoteCraft - Notion-like Notes",
  description:
    "A powerful note-taking app with rich text editing and hierarchical organization",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <MUIThemeProvider>{children}</MUIThemeProvider>
      </body>
    </html>
  );
}
