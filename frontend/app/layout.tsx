import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CivicFlow | Modern Civic Issue Reporting & Municipal Management",
  description: "A modern civic-tech platform connecting citizens and municipal authorities to report, track, and resolve urban infrastructure issues transparently.",
  keywords: ["civic tech", "issue reporting", "municipal management", "potholes", "smart city", "civic engagement"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F7F6F0] text-[#153B35] selection:bg-[#DCECE5] selection:text-[#153B35]">
        {children}
      </body>
    </html>
  );
}
