"use client";

import React from "react";
import Image from "next/image";
import { RotateCcw, Accessibility, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PaymentMethodPage({
  onPayHere,
  onPayAtCashier,
  onBack,
  onResetAll,
}: {
  onPayHere: () => void;
  onPayAtCashier: () => void;
  onBack: () => void;
  onResetAll: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col font-sans">

      {/* ── KONTEN UTAMA ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">

        {/* Logo */}
        <div className="w-16 h-16 relative">
          <Image src="/kopjay-logo.png" alt="kopi jaya" fill className="object-contain" />
        </div>

        {/* Judul */}
        <h1 className="text-3xl font-black text-gray-900 text-center leading-snug whitespace-pre-line">
          {t.payment.title}
        </h1>

        {/* Opsi: Bayar di Sini */}
        <button
          onClick={onPayHere}
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center py-8 gap-3 cursor-pointer active:scale-95 transition-transform hover:bg-gray-100"
        >
          <div className="relative w-40 h-32">
            <Image
              src="/payment-machine.png"
              alt="mesin pembayaran"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-base font-black text-gray-900">{t.payment.payHere}</span>
          <span className="text-[11px] text-gray-400 font-medium">{t.payment.payHereSub}</span>
        </button>

        {/* Pemisah */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400 font-bold">{t.payment.or}</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Opsi: Bayar di Kasir */}
        <button
          onClick={onPayAtCashier}
          className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-base font-black text-gray-800 active:scale-95 transition-transform hover:bg-gray-50"
        >
          {t.payment.payAtCashier}
        </button>

        {/* Tombol Kembali */}
        <button
          onClick={onBack}
          className="px-8 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} />
          {t.payment.back}
        </button>

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between px-5 py-3 gap-3">
          <button
            onClick={onResetAll}
            className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0"
          >
            <RotateCcw size={11} /> {t.payment.restartOrder}
          </button>
          <p className="text-[7.5px] text-gray-400 leading-tight text-right flex-1">
            {t.payment.halalNote}
          </p>
          <button className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0">
            <Accessibility size={11} /> {t.payment.accessibility}
          </button>
        </div>
      </div>

    </div>
  );
}