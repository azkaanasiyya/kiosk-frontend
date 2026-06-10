"use client";

import React, { useEffect } from "react";
import { BadgeCheck } from "lucide-react";
import { formatRp } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export default function SuccessScreen({
  totalPrice,
  onDone,
}: {
  totalPrice: number;
  onDone: () => void;
}) {
  const { t } = useLanguage();
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center gap-6 font-sans">
      {/* Ikon centang berlapis */}
      <div className="relative flex items-center justify-center">
        <div className="w-36 h-36 rounded-full bg-[#C84C34]/10" />
        <div className="absolute w-28 h-28 rounded-full bg-[#C84C34]/20" />
        <div className="absolute w-20 h-20 rounded-full bg-[#C84C34] flex items-center justify-center shadow-lg">
          <BadgeCheck size={36} className="text-white" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-2xl font-black text-gray-900 leading-snug whitespace-pre-line">
          {t.success.title}
        </p>
        <p className="text-sm text-gray-400 mt-2">{t.success.subtitle}</p>
        <p className="text-lg font-black text-gray-900 mt-2">{formatRp(totalPrice)}</p>
      </div>
    </div>
  );
}