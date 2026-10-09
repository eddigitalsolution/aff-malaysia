import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/Shell";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: "Harimau Malaya Analytics Hub - ASEAN Hyundai Cup 2026",
  description: "Premium tactical analysis, interactive starting lineups, and dynamic matchday statistics for the Malaysian National Football Team in the ASEAN Hyundai Cup 2026.",
  metadataBase: new URL("https://aff-malaysia.vercel.app"),
  keywords: ["Harimau Malaya", "Malaysia Football", "AFF Cup 2026", "Tactical Planner", "ASEAN Football", "Tan Cheng Hoe"],
  authors: [{ name: "Antigravity Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Harimau Malaya",
  },
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
  const isDev = process.env.NODE_ENV === 'development';
  const cspPolicy = isDev
    ? "default-src 'self' https: data: blob: 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' https: data:; connect-src 'self' https: wss: ws:;"
    : "default-src 'self' https: data: blob: 'unsafe-inline'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' https: data:; connect-src 'self' https: wss:;";

  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={cspPolicy} />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 selection:bg-amber-400 selection:text-zinc-950">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
