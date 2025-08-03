import "./globals.css";
import { Inter } from "next/font/google";
import { MUIThemeProvider } from "@/components/ThemeProvider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Clearview",
  description:
    "A journal app to encourage reflection and mindfulness while providing insights",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MUIThemeProvider>{children}</MUIThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
