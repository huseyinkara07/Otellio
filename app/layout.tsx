import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { metadata as siteMetadata, siteConfig } from "@/lib/content";

// Türkçe karakter desteği zorunlu: latin-ext alt kümesi ş, ğ, ı, İ, ö, ü, ç için gerekli.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://otellio.com"),
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    type: "website",
    locale: siteConfig.locale,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
