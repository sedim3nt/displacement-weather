import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Displacement Weather — AI Job Displacement Tracker",
  description: "Real-time tracking of AI-driven job displacement across industries, roles, and regions in the US.",
  keywords: ["AI jobs", "automation displacement", "future of work", "job market", "AI layoffs"],
  openGraph: {
    title: "Displacement Weather",
    description: "Like a weather radar for the labor market.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
