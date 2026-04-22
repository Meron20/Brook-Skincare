import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import SessionProvider from "@/components/shared/SessionProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brook Skincare | Hyperpigmentation & Skin Health",
  description: "Book a professional skin consultation with Brook Skincare. Expert care for hyperpigmentation and skin health — available online worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
         <SessionProvider>
            <Navbar />
            <main>{children}</main>
          </SessionProvider>
      </body>
    </html>
  );
}
