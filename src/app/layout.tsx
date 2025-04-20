// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

// (re‑declare your fonts if you need them)
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// (optional) metadata for Next.js
export const metadata = {
  title: "Detective",
  description: "…",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* This is your toast container */}
        <Toaster position="top-right" />

        {/* This renders the rest of your pages */}
        {children}
      </body>
    </html>
  );
}