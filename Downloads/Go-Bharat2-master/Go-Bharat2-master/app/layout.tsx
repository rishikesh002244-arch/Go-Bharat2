import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SIHLanguageProvider } from "@/components/sih-features/LanguageProvider";
import SOSFab from "@/components/sih-features/SOSFab";
import ServiceWorkerRegistration from "@/components/sih-features/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Go-Bharat | Discover Incredible India 🇮🇳",
  description:
    "Explore heritage, pristine nature, royal hotels, delicious regional cuisines, and vibrant cultures across India with AI-powered travel planning.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f97316",
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
      <body className="min-h-full flex flex-col bg-[#fafafa] text-[#14213d]">
        <SIHLanguageProvider>
          <AuthProvider>{children}</AuthProvider>
          <SOSFab />
          <ServiceWorkerRegistration />
        </SIHLanguageProvider>
      </body>
    </html>
  );
}
