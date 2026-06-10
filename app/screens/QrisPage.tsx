"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { RotateCcw, Accessibility, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { CartItem, formatRp } from "./types";
import { useLanguage } from "@/context/LanguageContext";
import { createQrisPayment, fetchPaymentStatus } from "@/lib/api";
import QRCode from "qrcode";

const POLLING_INTERVAL_MS = 3000;  // cek status setiap 3 detik
const QRIS_EXPIRY_MINUTES = 30;    // default expiry QRIS Midtrans

export default function QRISPage({
  cart,
  tableNumber,
  orderNumber,
  orderId,
  onPaymentSuccess,
  onResetAll,
}: {
  cart: CartItem[];
  tableNumber: string | null;
  orderNumber: string;
  orderId: number | null;
  onPaymentSuccess: () => void;
  onResetAll: () => void;
}) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [state, setState] = useState<"loading" | "ready" | "paid" | "expired" | "error">("loading");
  const [errorMsg, setErrorMsg]   = useState("");
  const [amount, setAmount]       = useState(0);
  const [timeLeft, setTimeLeft]   = useState(QRIS_EXPIRY_MINUTES * 60); // detik
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const totalAmount = cart.reduce((s, item) => s + item.totalPrice, 0);

  // ─── FETCH QRIS DARI BACKEND ────────────────────────────────────────────────
  useEffect(() => {
    if (!orderId) return;

    createQrisPayment(orderId)
      .then((payment) => {
        setAmount(payment.amount);
        setPaymentId(payment.payment_id);

        // Hitung sisa waktu dari expired_at
        if (payment.expired_at) {
          const expiry    = new Date(payment.expired_at).getTime();
          const now       = Date.now();
          const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
          setTimeLeft(remaining);
        }

        // Render QR code ke canvas dari qr_string Midtrans
        const qrData = payment.qr_string || payment.qr_url;
        if (qrData && canvasRef.current) {
          QRCode.toCanvas(canvasRef.current, qrData, {
            width: 220,
            margin: 2,
            color: { dark: "#1a1a1a", light: "#ffffff" },
          }).then(() => setState("ready"))
            .catch(() => {
              setErrorMsg("Gagal render QR code.");
              setState("error");
            });
        } else {
          setErrorMsg("QR string tidak tersedia dari server.");
          setState("error");
        }
      })
      .catch((err) => {
        setErrorMsg(err.message ?? "Gagal membuat QRIS.");
        setState("error");
      });
  }, [orderId]);

  if (!orderId) {
    // tambahkan ini:
    return (
      <div className="w-screen h-screen bg-white flex flex-col items-center justify-center gap-4">
        <AlertCircle size={48} className="text-red-300" />
        <p className="text-sm font-black text-gray-500">Order ID tidak ditemukan</p>
        <button onClick={onResetAll} className="px-8 py-3 bg-[#C84C34] text-white rounded-xl text-sm font-black">
          Mulai Ulang
        </button>
      </div>
    );
  }

  // ─── POLLING STATUS PEMBAYARAN ──────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (state !== "ready" || !orderId) return;

    const interval = setInterval(async () => {
      try {
        const status = await fetchPaymentStatus(orderId);
        if (status.payment_status === "success") {
          setState("paid");
          clearInterval(interval);
          setTimeout(onPaymentSuccess, 1500);
        } else if (status.payment_status === "failed" || status.payment_status === "expired") {
          setState("expired");
          clearInterval(interval);
        }
      } catch {
        // Diam, coba lagi di interval berikutnya
      }
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [state, orderId, onPaymentSuccess]);

  // ─── COUNTDOWN TIMER ────────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (state !== "ready") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setState("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state]);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Warna countdown: merah jika < 5 menit
  const timeColor = timeLeft < 300 ? "text-red-500" : "text-gray-500";

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col font-sans">

      {/* ── KONTEN UTAMA ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 overflow-y-auto no-scrollbar">

        {/* Logo */}
        <div className="w-14 h-14 relative">
          <Image src="/kopjay-logo.png" alt="kopi jaya" fill className="object-contain" />
        </div>

        {/* Judul */}
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900">{t.qris.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{t.qris.subtitle}</p>
        </div>

        {/* QR Code area */}
        <div className="border-2 border-gray-100 rounded-2xl p-4 shadow-sm relative">

          {/* Loading state */}
          {state === "loading" && (
            <div className="w-[220px] h-[220px] flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-[#C84C34] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400 font-bold animate-pulse">Membuat QRIS...</p>
            </div>
          )}

          {/* Canvas QR — selalu ada di DOM, disembunyikan saat tidak ready */}
          <canvas
            ref={canvasRef}
            className={`rounded-xl ${state === "ready" ? "block" : "hidden"}`}
          />

          {/* Paid state */}
          {state === "paid" && (
            <div className="w-[220px] h-[220px] flex flex-col items-center justify-center gap-3">
              <CheckCircle2 size={64} className="text-[#C84C34]" />
              <p className="text-sm font-black text-gray-700">{t.qris.successLabel}</p>
            </div>
          )}

          {/* Expired state */}
          {state === "expired" && (
            <div className="w-[220px] h-[220px] flex flex-col items-center justify-center gap-3 text-center">
              <Clock size={48} className="text-gray-300" />
              <p className="text-sm font-black text-gray-500">QRIS Kedaluwarsa</p>
              <p className="text-xs text-gray-400">Silakan mulai ulang pesanan</p>
            </div>
          )}

          {/* Error state */}
          {state === "error" && (
            <div className="w-[220px] h-[220px] flex flex-col items-center justify-center gap-3 text-center px-4">
              <AlertCircle size={48} className="text-red-300" />
              <p className="text-sm font-black text-gray-500">Gagal memuat QRIS</p>
              <p className="text-xs text-gray-400">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Info pembayaran */}
        <div className="text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t.qris.totalLabel}</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{formatRp(amount || totalAmount)}</p>

          {tableNumber && (
            <p className="text-xs text-gray-400 mt-1">
              {t.qris.tableLabel}: <span className="font-black text-gray-700">{tableNumber}</span>
            </p>
          )}

          <p className="text-xs text-gray-400 mt-0.5">
            {t.qris.orderLabel}: <span className="font-black text-gray-700">#{orderNumber}</span>
          </p>

          {/* Countdown */}
          {state === "ready" && (
            <p className={`text-sm font-black mt-2 ${timeColor}`}>
              Berlaku: {formatTime(timeLeft)}
            </p>
          )}
        </div>

        {/* Tombol reset jika expired/error */}
        {(state === "expired" || state === "error") && (
          <button
            onClick={onResetAll}
            className="px-8 py-3 bg-[#C84C34] text-white rounded-xl text-sm font-black shadow-md"
          >
            Mulai Ulang Pesanan
          </button>
        )}

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-100">
        <div className="flex items-center justify-between px-5 py-3 gap-3">
          <button
            onClick={onResetAll}
            className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0"
          >
            <RotateCcw size={11} /> {t.qris.restartOrder}
          </button>
          <p className="text-[7.5px] text-gray-400 leading-tight text-right flex-1">
            {t.qris.halalNote}
          </p>
          <button className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0">
            <Accessibility size={11} /> {t.qris.accessibility}
          </button>
        </div>
      </div>

    </div>
  );
}