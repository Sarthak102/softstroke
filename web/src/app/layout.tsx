import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { themeScript } from "@/lib/theme";
import "./globals.css";
import { ICON_COUNT } from "@/lib/count";
import { SITE_URL } from "@/lib/site";
import { FeedbackModal } from "@/components/Feedback";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Relative URLs (og.png) resolve against this, including the /softstroke base path.
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Softstroke | Soft, rounded open-source icons",
  description: `${ICON_COUNT} soft, rounded icons in stroke and solid for React, React Native, Flutter, Vue, Svelte, Angular, SVG and an icon font. MIT licensed.`,
  openGraph: {
    type: "website",
    siteName: "Softstroke",
    title: "Softstroke | Soft, rounded open-source icons",
    description: `${ICON_COUNT} icons in stroke and solid for every major framework. MIT licensed.`,
    images: [{ url: "og.png", width: 1200, height: 630, alt: "Softstroke: soft icons for crisp interfaces" }],
  },
  twitter: { card: "summary_large_image", images: ["og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScroll />
        {children}
        <FeedbackModal />
      </body>
    </html>
  );
}
