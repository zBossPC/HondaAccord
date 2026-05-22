import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hondaaccord.lol";

export const metadata: Metadata = {
  title: "HondaAccord — The future of private chat",
  description:
    "A fast, native desktop app for private group chat, voice, and screen sharing. Built for friend groups — not public servers.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "HondaAccord",
    description: "Fast, native chat for friends. Voice, screen share, and private Spaces.",
    type: "website",
    siteName: "HondaAccord",
    url: siteUrl,
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "HondaAccord" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HondaAccord",
    description: "The future of private chat.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
