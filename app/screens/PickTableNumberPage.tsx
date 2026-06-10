"use client";

import React from "react";
import Image from "next/image";
import { RotateCcw, Accessibility } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PickTableNumberPage({
  onContinue,
  onResetAll,
}: {
  onContinue: () => void;
  onResetAll: () => void;
}) {
    const { t } = useLanguage();
  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col font-sans">

      {/* ── KONTEN UTAMA ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 gap-10">

        {/* Logo */}
        <div className="w-16 h-16 relative">
          <Image src="/kopjay-logo.png" alt="kopi jaya" fill className="object-contain" />
        </div>

        {/* Teks instruksi */}
        <h1 className="text-3xl font-black text-gray-900 text-center leading-snug whitespace-pre-line">
          {t.pickTable.title}
        </h1>

        {/* Ilustrasi */}
        <div className="w-48 h-48 relative">
          <Image
            src="/counter-illustration.png"
            alt="konter"
            fill
            className="object-contain"
          />
        </div>

        {/* Tombol lanjut */}
        <button
          onClick={onContinue}
          className="w-full py-4 bg-[#C84C34] text-white rounded-2xl text-base font-black shadow-md active:scale-95 transition-transform"
        >
          {t.pickTable.continue}
        </button>

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-100">
        <div className="flex items-center justify-between px-5 py-3 gap-3">
          <button
            onClick={onResetAll}
            className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0"
          >
            <RotateCcw size={11} /> {t.pickTable.restartOrder}
          </button>
          <p className="text-[7.5px] text-gray-400 leading-tight text-right flex-1">
            {t.pickTable.halalNote}
          </p>
          <button className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0">
            <Accessibility size={11} /> {t.pickTable.accessibility}
          </button>
        </div>
      </div>

    </div>
  );
}