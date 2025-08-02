import "./globals.css";
import { Inter } from "next/font/google";
import { MUIThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Clearview",
  description:
    "A journal app to encourage reflection and mindfulness while providing insights",
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
