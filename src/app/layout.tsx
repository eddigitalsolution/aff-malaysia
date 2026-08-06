import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harimau Malaya Analytics Hub - ASEAN Hyundai Cup 2026",
  description: "Premium tactical analysis, interactive starting lineups, and dynamic matchday statistics for the Malaysian National Football Team in the ASEAN Hyundai Cup 2026.",
  metadataBase: new URL("https://aff-malaysia.vercel.app"),
  keywords: ["Harimau Malaya", "Malaysia Football", "AFF Cup 2026", "Tactical Planner", "ASEAN Football", "Pau Marti Vicente", "Tan Cheng Hoe"],
  authors: [{ name: "Antigravity Team" }],
  openGraph: {
    title: "Harimau Malaya Analytics Hub - ASEAN Hyundai Cup 2026",
    description: "Premium tactical analysis, interactive starting lineups, and dynamic matchday statistics for the Malaysian National Football Team.",
    url: "https://aff-malaysia.vercel.app",
    siteName: "Harimau Malaya Analytics Hub",
    images: [
      {
        url: "/malaysia-logo.png",
        width: 512,
        height: 512,
        alt: "Harimau Malaya Football Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Harimau Malaya Analytics Hub - ASEAN Hyundai Cup 2026",
    description: "Premium tactical analysis, interactive starting lineups, and dynamic matchday statistics for the Malaysian National Football Team.",
    images: ["/malaysia-logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" }
    ],
    apple: "/icon.png",
  },
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
