import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASEAN Hyundai Cup 2026 Analytics",
  description: "Premium football analytics platform for the ASEAN Hyundai Cup 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-zinc-950">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
