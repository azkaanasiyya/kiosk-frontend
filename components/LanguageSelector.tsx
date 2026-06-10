"use client";

// ─────────────────────────────────────────────────────────────────────────────
// LanguageSelector.tsx
// Sekarang mengubah bahasa global via LanguageContext,
// bukan hanya state lokal komponen ini.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/context/Translations";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const options: { id: Language; label: string }[] = [
    { id: "id", label: t.languageSelector.indonesia },
    { id: "en", label: t.languageSelector.english },
  ];

  return (
    <div className="grid grid-cols-2 w-full gap-5">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => setLanguage(option.id)}
          className={`
            relative flex items-center justify-center cursor-pointer w-full p-6 rounded-[12px] border transition-all duration-200
            ${language === option.id
              ? "border-primary-600 bg-linear-to-b from-white to-grayscale-200 shadow-[0_0_0_1px_rgba(176,71,46,0.1)]"
              : "border-grayscale-400 bg-linear-to-b from-white to-grayscale-200 shadow-[0_0_0_1px_rgba(176,71,46,0.1)]"
            }
          `}
        >
          {/* Radio button */}
          <div className="absolute left-6 flex items-center justify-center">
            <div className={`
              w-6 h-6 rounded-full border-4 flex items-center justify-center
              ${language === option.id ? "border-primary-600" : "border-grayscale-400"}
            `}>
              {language === option.id && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
              )}
            </div>
          </div>

          <span className="text-[18px] font-medium text-grayscale-900">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;