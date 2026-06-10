"use client";

import React from "react";
import Image from "next/image";
import { RotateCcw, Accessibility, BadgeCheck, Printer } from "lucide-react";
import { CartItem, MemberInfo, formatRp } from "./types";
import { useLanguage } from "@/context/LanguageContext";
import type { ApiConfig } from "@/lib/api";

type ReceiptStatus = "paid" | "pending";

export default function ReceiptPage({
  cart,
  tableNumber,
  orderNumber,
  orderId,
  status,
  member,
  totalPoints,
  kioskConfig,
  onPrint,
  onDone,
  onResetAll,
}: {
  cart: CartItem[];
  tableNumber: string | null;
  orderNumber: string;
  orderId: number | null;
  status: ReceiptStatus;
  member: MemberInfo;
  totalPoints: number;
  kioskConfig: ApiConfig | null;
  onPrint: () => void;
  onDone: () => void;
  onResetAll: () => void;
}) {
  const { t } = useLanguage();
  const isPaid = status === "paid";

  // ─── KALKULASI HARGA ───────────────────────────────────────────────────────
  const subTotal     = cart.reduce((s, item) => s + item.totalPrice, 0);
  const taxRate      = kioskConfig?.tax?.rate ?? 0;
  const serviceRate  = kioskConfig?.service_charge?.rate ?? 0;
  const taxAmount    = Math.round(subTotal * taxRate);
  const serviceAmount= Math.round(subTotal * serviceRate);
  const totalFinal   = subTotal + taxAmount + serviceAmount;

  const hasTax       = taxAmount > 0;
  const hasService   = serviceAmount > 0;

  const logoSrc  = "/kopjay-logo.png";
  const storeName = "Kopi Jaya";

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col font-sans">

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-8 pb-4">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 relative">
            <Image src={logoSrc} alt={storeName} fill className="object-contain" />
          </div>
        </div>

        {/* Judul */}
        <h1 className="text-2xl font-black text-gray-900 text-center leading-snug mb-6 whitespace-pre-line">
          {isPaid ? t.receipt.titlePaid : t.receipt.titlePending}
        </h1>

        {/* ── KARTU STRUK ────────────────────────────────────────────────── */}
        <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-4">

          {/* Header status */}
          <div className="flex flex-col items-center py-5 border-b border-dashed border-gray-200 gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPaid ? "bg-[#C84C34]" : "bg-yellow-400"}`}>
              <BadgeCheck size={22} className="text-white" />
            </div>
            <p className="text-sm font-black text-gray-900">{t.receipt.yourOrder}</p>
            {!isPaid && (
              <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                {t.receipt.pendingBadge}
              </span>
            )}
          </div>

          {/* Info order */}
          <div className="px-5 py-4 flex flex-col gap-1 border-b border-dashed border-gray-200">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{t.receipt.orderNo}</span>
              <span className="font-black text-gray-900">#{orderNumber}</span>
            </div>
            {orderId && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Ref ID</span>
                <span className="font-bold text-gray-500">{orderId}</span>
              </div>
            )}
            {tableNumber && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{t.receipt.tableNo}</span>
                <span className="font-black text-gray-900">{tableNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{t.receipt.type}</span>
              <span className="font-black text-gray-900">
                {tableNumber ? t.receipt.dineIn : t.receipt.takeAway}
              </span>
            </div>
          </div>

          {/* Daftar item */}
          <div className="px-5 py-4 flex flex-col gap-3 border-b border-dashed border-gray-200">
            {cart.map((item) => {
              const modifierSummary = (item.modifiers ?? [])
                .map((m) => m.name)
                .join(", ");
              const addonSummary = item.addons
                .filter((x) => x.qty > 0)
                .map((x) => `${x.qty}x ${x.addon.name}`)
                .join(", ");
              const summary = [modifierSummary, addonSummary].filter(Boolean).join(", ");

              return (
                <div key={item.cartId} className="flex justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">
                      {item.qty}x {item.product.name}
                    </p>
                    {summary && (
                      <p className="text-[10px] text-gray-400">{summary}</p>
                    )}
                  </div>
                  <p className="text-xs font-bold text-gray-900 shrink-0">
                    {formatRp(item.totalPrice)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── BREAKDOWN HARGA ──────────────────────────────────────────── */}
          <div className="px-5 py-4 flex flex-col gap-1.5">

            {/* Subtotal */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>{t.receipt.subTotal}</span>
              <span>{formatRp(subTotal)}</span>
            </div>

            {/* Tax — hanya tampil jika ada */}
            {hasTax && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  {kioskConfig?.tax?.name ?? "Pajak"}
                  <span className="ml-1 text-[10px]">
                    ({(taxRate * 100).toFixed(0)}%)
                  </span>
                </span>
                <span>{formatRp(taxAmount)}</span>
              </div>
            )}

            {/* Service charge — hanya tampil jika ada */}
            {hasService && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  {kioskConfig?.service_charge?.name ?? "Service"}
                  <span className="ml-1 text-[10px]">
                    ({(serviceRate * 100).toFixed(0)}%)
                  </span>
                </span>
                <span>{formatRp(serviceAmount)}</span>
              </div>
            )}

            {/* Garis pemisah jika ada tax/service */}
            {(hasTax || hasService) && (
              <div className="border-t border-dashed border-gray-200 my-1" />
            )}

            {/* Total final */}
            <div className="flex justify-between">
              <span className="text-sm font-black text-gray-900">{t.receipt.total}</span>
              <span className="text-sm font-black text-gray-900">{formatRp(totalFinal)}</span>
            </div>
          </div>

          {/* Dekorasi bawah struk (efek gigi roda) */}
          <div
            className="h-4 w-full"
            style={{
              background: "radial-gradient(circle at 10px -2px, white 8px, #f3f4f6 8px) repeat-x bottom / 20px 16px",
            }}
          />
        </div>

        {/* Nomor meja besar */}
        {tableNumber && (
          <div className="text-center mb-4">
            <p className="text-xs text-gray-400">No.</p>
            <p className="text-6xl font-black text-gray-900">{tableNumber}</p>
          </div>
        )}

        {/* Info poin member */}
        {member.type === "member" && totalPoints > 0 && (
          <div className="mt-2 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0 text-lg">
              ⭐
            </div>
            <div>
              <p className="text-xs text-amber-700 font-bold">
                Halo, {member.type === "member" ? member.name : ""}!
              </p>
              <p className="text-sm font-black text-gray-900">
                +{totalPoints} poin telah ditambahkan
              </p>
              <p className="text-[10px] text-gray-400">Cek poin di aplikasi {storeName}</p>
            </div>
          </div>
        )}

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-t border-gray-100">
        <div className="px-5 pt-3 pb-2 flex gap-3">
          <button
            onClick={onPrint}
            className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-black text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Printer size={16} /> {t.receipt.print}
          </button>
          <button
            onClick={onDone}
            className="flex-2 py-3.5 bg-[#C84C34] rounded-xl text-sm font-black text-white shadow-md active:scale-95 transition-transform"
          >
            {t.receipt.done}
          </button>
        </div>

        <div className="flex items-center justify-between px-5 pb-3 gap-3">
          <button
            onClick={onResetAll}
            className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0"
          >
            <RotateCcw size={11} /> {t.receipt.restartOrder}
          </button>
          <p className="text-[7.5px] text-gray-400 leading-tight text-right flex-1">
            {t.receipt.halalNote}
          </p>
          <button className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0">
            <Accessibility size={11} /> {t.receipt.accessibility}
          </button>
        </div>
      </div>

    </div>
  );
}