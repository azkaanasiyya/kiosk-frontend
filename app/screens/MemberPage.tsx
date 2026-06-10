"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RotateCcw, Accessibility, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { lookupMember } from "@/lib/api";
import { MemberInfo } from "./types";

// ─── NUMPAD ───────────────────────────────────────────────────────────────────
const NUMPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["+62", "0", "⌫"],
];

// ─── HELPER FORMAT NOMOR ──────────────────────────────────────────────────────
function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length <= 4) return d;
  if (d.length <= 8) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 8)}-${d.slice(8)}`;
}

// Normalisasi ke format 08xxx (backend menyimpan dengan awalan 0)
function normalizePhone(phone: string): string {
  if (phone.startsWith("0")) return phone;
  return "0" + phone;
}

// ─── KOMPONEN UTAMA ───────────────────────────────────────────────────────────
export default function MemberPage({
  onContinue,
  onSkip,
  onResetAll,
}: {
  onContinue: (member: MemberInfo) => void;
  onSkip: () => void;
  onResetAll: () => void;
}) {
  const { t } = useLanguage();

  const [phone, setPhone]           = useState("");
  const [status, setStatus]         = useState<"idle" | "loading" | "found" | "notfound" | "error">("idle");
  const [memberName, setMemberName] = useState("");
  const [memberId, setMemberId]     = useState<number | undefined>(undefined);
  const [errorMsg, setErrorMsg]     = useState("");

  const formatted = formatPhone(phone);

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setPhone((prev) => prev.slice(0, -1));
      setStatus("idle");
      return;
    }
    if (key === "+62") return;
    if (phone.length >= 13) return;
    setPhone((prev) => prev + key);
    setStatus("idle");
  };

  const handleCheck = async () => {
    if (phone.length < 9) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const normalized = normalizePhone(phone);
      const member = await lookupMember(normalized);
      setMemberName(member.name);
      setMemberId(member.member_id);
      setStatus("found");
    } catch (err) {
      // lookupMember throw Error jika 404 (member tidak ditemukan)
      // atau error jaringan lainnya
      const message = err instanceof Error ? err.message : "";
      if (message === "Member tidak ditemukan") {
        setStatus("notfound");
      } else {
        // Error jaringan / server down
        setStatus("error");
        setErrorMsg("Tidak dapat terhubung ke server. Coba lagi.");
      }
    }
  };

  const handleConfirm = () => {
    if (status === "found") {
      onContinue({
        type: "member",
        phone: normalizePhone(phone),
        name: memberName,
        member_id: memberId,
      });
    }
  };

  const handleReset = () => {
    setPhone("");
    setStatus("idle");
    setMemberName("");
    setMemberId(undefined);
    setErrorMsg("");
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col font-sans">

      {/* ── KONTEN ATAS ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">

        {/* Logo */}
        <div className="w-14 h-14 relative">
          <Image src="/kopjay-logo.png" alt="kopi jaya" fill className="object-contain" />
        </div>

        {/* Judul */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900 leading-snug">
            {t.member.title}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{t.member.subtitle}</p>
        </div>

        {/* Display nomor HP */}
        <div className="w-full">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4">
            <span className="text-base font-black text-gray-400 shrink-0">+62</span>
            <div className="w-px h-6 bg-gray-200" />
            <span className={`flex-1 text-xl font-black tracking-wider ${phone ? "text-gray-900" : "text-gray-300"}`}>
              {phone ? formatted : "8xx-xxxx-xxxx"}
            </span>
            {phone.length > 0 && (
              <button onClick={handleReset} className="shrink-0 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Status feedback */}
          {status === "loading" && (
            <p className="text-xs text-gray-400 text-center mt-2 animate-pulse">
              {t.member.checking}
            </p>
          )}

          {status === "found" && (
            <div className="mt-3 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-black">✓</span>
              </div>
              <div>
                <p className="text-xs font-black text-green-700">{t.member.memberFound}</p>
                <p className="text-sm font-black text-gray-900">{memberName}</p>
              </div>
            </div>
          )}

          {status === "notfound" && (
            <div className="mt-3 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-black">✗</span>
              </div>
              <div>
                <p className="text-xs font-black text-red-600">{t.member.memberNotFound}</p>
                <p className="text-[10px] text-gray-400">{t.member.memberNotFoundHint}</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mt-3 flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-black">!</span>
              </div>
              <div>
                <p className="text-xs font-black text-yellow-700">Gagal terhubung</p>
                <p className="text-[10px] text-gray-400">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tombol cek / konfirmasi */}
        {status !== "found" ? (
          <button
            onClick={handleCheck}
            disabled={phone.length < 9 || status === "loading"}
            className={`w-full py-4 rounded-2xl text-base font-black transition-all flex items-center justify-center gap-2 ${
              phone.length >= 9 && status !== "loading"
                ? "bg-[#C84C34] text-white shadow-md active:scale-95"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {status === "loading" ? t.member.checking : t.member.checkButton}
            {status !== "loading" && <ChevronRight size={18} />}
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl text-base font-black bg-[#C84C34] text-white shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            {t.member.continueButton}
            <ChevronRight size={18} />
          </button>
        )}

        {/* Tombol skip */}
        <button
          onClick={onSkip}
          className="text-sm font-bold text-gray-400 underline underline-offset-2"
        >
          {t.member.skip}
        </button>

      </div>

      {/* ── NUMPAD ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-t border-gray-100">
        <div className="grid grid-cols-3">
          {NUMPAD_KEYS.map((row, rIdx) =>
            row.map((key, cIdx) => {
              const isPrefix    = key === "+62";
              const isBackspace = key === "⌫";
              const SUB: Record<string, string> = {
                "2": "ABC", "3": "DEF", "4": "GHI", "5": "JKL",
                "6": "MNO", "7": "PQRS", "8": "TUV", "9": "WXYZ",
              };
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleKey(key)}
                  className={`
                    flex flex-col items-center justify-center py-4 border-t border-r border-gray-100
                    active:bg-gray-100 transition-colors select-none
                    ${cIdx === 2 ? "border-r-0" : ""}
                    ${isPrefix ? "opacity-30 cursor-default" : ""}
                  `}
                >
                  {isBackspace ? (
                    <span className="text-xl text-gray-600">⌫</span>
                  ) : isPrefix ? (
                    <span className="text-base font-bold text-gray-400">+62</span>
                  ) : (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xl font-bold text-gray-900">{key}</span>
                      {SUB[key] && (
                        <span className="text-[7px] font-bold text-gray-400 tracking-widest">
                          {SUB[key]}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 gap-3 border-t border-gray-100">
          <button
            onClick={onResetAll}
            className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0"
          >
            <RotateCcw size={11} /> {t.member.restartOrder}
          </button>
          <button className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0">
            <Accessibility size={11} /> {t.member.accessibility}
          </button>
        </div>
      </div>

    </div>
  );
}