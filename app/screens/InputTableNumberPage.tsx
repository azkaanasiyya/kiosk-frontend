"use client";

import React, { useState } from "react";
import { Delete } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Tombol numpad sesuai desain
const NUMPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["+*#", "0", "⌫"],
];

export default function InputTableNumberPage({
  onConfirm,
}: {
  onConfirm: (tableNumber: string) => void;
}) {
    const { t } = useLanguage();
  const [value, setValue] = useState("");

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setValue((prev) => prev.slice(0, -1));
    } else if (key === "+*#") {
      // Tidak digunakan untuk input meja, abaikan
    } else {
      // Maksimal 3 digit nomor meja
      if (value.length < 3) {
        setValue((prev) => prev + key);
      }
    }
  };

  const handleConfirm = () => {
    if (value.length > 0) {
      onConfirm(value);
    }
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col font-sans">

      {/* ── AREA DISPLAY ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">

        {/* Judul */}
        <h1 className="text-3xl font-black text-gray-900 text-center leading-snug whitespace-pre-line">
          {t.inputTable.title}
        </h1>

        {/* Display angka */}
        <div className="w-full bg-gray-100 rounded-2xl py-5 px-6 text-center">
          <span className="text-4xl font-black text-gray-900 tracking-widest">
            {value || <span className="text-gray-300">—</span>}
          </span>
        </div>

      </div>

      {/* ── NUMPAD ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-t border-gray-100">
        <div className="grid grid-cols-3">
          {NUMPAD_KEYS.map((row, rIdx) =>
            row.map((key, cIdx) => {
              const isBackspace = key === "⌫";
              const isSpecial   = key === "+*#";
              const isZero      = key === "0";
              const isConfirmRow = rIdx === NUMPAD_KEYS.length - 1;

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => {
                    if (isConfirmRow && cIdx === 2 && value.length > 0) {
                      // ⌫ key
                      handleKey("⌫");
                    } else {
                      handleKey(key);
                    }
                  }}
                  className={`
                    flex flex-col items-center justify-center py-5 border-t border-r border-gray-100
                    active:bg-gray-100 transition-colors select-none
                    ${cIdx === 2 ? "border-r-0" : ""}
                    ${isSpecial ? "opacity-30" : ""}
                  `}
                >
                  {isBackspace ? (
                    <Delete size={22} className="text-gray-700" />
                  ) : (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-2xl font-bold text-gray-900">{key}</span>
                      {/* Sub-label huruf seperti keypad telepon */}
                      {!isSpecial && !isZero && key !== "1" && (
                        <span className="text-[8px] font-bold text-gray-400 tracking-widest">
                          {["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"][
                            parseInt(key)
                          ]}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Tombol Konfirmasi */}
        <div className="px-5 pb-6 pt-3">
          <button
            onClick={handleConfirm}
            disabled={value.length === 0}
            className={`w-full py-4 rounded-2xl text-base font-black transition-all ${
              value.length > 0
                ? "bg-[#C84C34] text-white shadow-md active:scale-95"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {t.inputTable.confirm}
          </button>
        </div>
      </div>

    </div>
  );
}