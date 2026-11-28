import type { Metadata } from "next";
import React from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CCTV Lorong Dashboard",
  description: "Dashboard Monitoring & Pengecekan Perangkat CCTV Lorong",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
