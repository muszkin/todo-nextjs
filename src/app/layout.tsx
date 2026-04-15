import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { TopNav } from "@/components/TopNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "Personal todo with reminders, calendar, and owners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <TopNav />
        <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">{children}</main>
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
