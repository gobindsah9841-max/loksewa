import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Loksewa Pro — Complete Nepal Public Service Commission (PSC & PPSC) Exam Preparation",
  description:
    "Comprehensive bilingual (Nepali & English) examination preparation platform for Federal Loksewa Aayog, all 7 Provincial Public Service Commissions (PPSC), and Fifth Level General Administration.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F294A" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1120" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased dark:bg-[#0B1120] dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
