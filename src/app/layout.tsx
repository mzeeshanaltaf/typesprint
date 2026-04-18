import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { BfcacheGuard } from "@/components/bfcache-guard";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TypeSprint — Learn Typing Faster & Smarter",
    template: "%s · TypeSprint",
  },
  description:
    "Improve your typing speed, accuracy, and confidence with real-time practice, structured lessons, and progress tracking.",
  keywords: [
    "typing tutor",
    "wpm test",
    "typing practice",
    "learn typing",
    "typing speed",
  ],
  openGraph: {
    title: "TypeSprint — Learn Typing Faster & Smarter",
    description:
      "Real-time WPM, accuracy tracking, structured lessons, and progress analytics.",
    type: "website",
    url: siteUrl,
    siteName: "TypeSprint",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeSprint",
    description:
      "Improve your typing speed and accuracy with structured practice.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BfcacheGuard />
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
