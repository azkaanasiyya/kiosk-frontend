"use client";

// ─────────────────────────────────────────────────────────────────────────────
// LanguageContext.tsx
//
// Cara pakai di setiap halaman:
//
//   import { useLanguage } from "@/contexts/LanguageContext";
//
//   export default function SomePage() {
//     const { t, language, setLanguage } = useLanguage();
//     return <h1>{t.menu.orderNow}</h1>;
//   }
//
// Wrap di layout.tsx:
//
//   import { LanguageProvider } from "@/contexts/LanguageContext";
//   <LanguageProvider>{children}</LanguageProvider>
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useCallback } from "react";
import { translations, Language } from "./Translations";

// Tipe t yang mencakup KEDUA bahasa (id & en), bukan hanya salah satu
type T = typeof translations[Language];

// ─── TIPE CONTEXT ─────────────────────────────────────────────────────────────
type LanguageContextType = {
  /** Bahasa aktif saat ini: "id" | "en" */
  language: Language;
  /** Fungsi untuk mengganti bahasa */
  setLanguage: (lang: Language) => void;
  /** Object terjemahan — akses via t.namaHalaman.namaKey */
  t: T;
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextType | null>(null);

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language] as T,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage harus dipakai di dalam <LanguageProvider>");
  }
  return ctx;
}