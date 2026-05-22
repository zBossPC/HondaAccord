import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hondaaccord.app";

export const metadata: Metadata = {
  title: "HondaAccord — Fast, native chat for friends",
  description:
    "A lightweight Discord-style desktop app for chatting with friends. Private Spaces, voice channels, screen sharing, and DMs — without public servers.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "HondaAccord",
    description:
      "Fast, native chat for friends. Text, voice, video, and screen share in private Spaces.",
    type: "website",
    siteName: "HondaAccord",
    images: [{ url: "/icon.png", width: 512, height: 512, alt: "HondaAccord" }],
  },
  twitter: {
    card: "summary",
    title: "HondaAccord",
    description: "Fast, native chat for friends.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
