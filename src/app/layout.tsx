import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

import { BfcacheGuard } from "@/components/bfcache-guard";
import { JsonLd } from "@/components/seo/json-ld";
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
  alternates: {
    canonical: "/",
  },
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
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TypeSprint",
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TypeSprint",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/lessons?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
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
        <JsonLd data={[organizationLd, websiteLd]} />
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
        <Analytics />
      </body>
    </html>
  );
}
