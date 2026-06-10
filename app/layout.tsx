import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Kopi Jaya Kiosk",
  description: "Self-order kiosk for Kopi Jaya",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${interTight.variable} antialiased`}>
        {/* LanguageProvider membungkus seluruh app agar semua halaman
            bisa akses bahasa aktif via useLanguage() */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}