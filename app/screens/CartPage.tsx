"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, RotateCcw, Accessibility } from "lucide-react";
import { CartItem, formatRp } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export default function CartPage({
  cart,
  onUpdateQty,
  onRemove,
  onAddMore,
  onCheckout,
  onResetAll,
}: {
  cart: CartItem[];
  onUpdateQty: (cartId: string, qty: number) => void;
  onRemove: (cartId: string) => void;
  onAddMore: () => void;
  onCheckout: () => void;
  onResetAll: () => void;
}) {
  const { t } = useLanguage();
  const subTotal = cart.reduce((s, item) => s + item.totalPrice, 0);

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col font-sans">

      {/* ── KONTEN SCROLL ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4 px-5 pt-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart size={28} className="text-[#C84C34]" />
          <h1 className="text-2xl font-black text-gray-900">{t.cart.title}</h1>
        </div>

        {/* Daftar item */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <ShoppingCart size={48} className="opacity-30" />
            <p className="text-sm font-bold">{t.cart.empty}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <CartItemRow
                key={item.cartId}
                item={item}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-t border-gray-100">

        {/* Sub-total & Total */}
        {cart.length > 0 && (
          <div className="px-5 pt-4 pb-2 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{t.cart.subTotal}</span>
              <span className="text-sm text-gray-700">{formatRp(subTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-black text-gray-900">{t.cart.total}</span>
              <span className="text-xl font-black text-gray-900">{formatRp(subTotal)}</span>
            </div>
          </div>
        )}

        {/* Tombol aksi */}
        <div className="px-5 py-3 flex gap-3">
          <button
            onClick={onAddMore}
            className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-black text-gray-700 hover:bg-gray-50 transition-colors leading-tight text-center"
          >
            {t.cart.addMore}
          </button>
          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className={`grow-2 py-3.5 rounded-xl text-sm font-black text-white transition-all ${
              cart.length > 0
                ? "bg-[#C84C34] shadow-md"
                : "bg-[#C84C34]/30 text-[#C84C34]/60"
            }`}
          >
            {t.cart.checkout}
          </button>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-5 pb-3 gap-3">
          <button
            onClick={onResetAll}
            className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0"
          >
            <RotateCcw size={11} /> {t.cart.restartOrder}
          </button>
          <p className="text-[7.5px] text-gray-400 leading-tight text-right flex-1">
            {t.cart.halalNote}
          </p>
          <button className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0">
            <Accessibility size={11} /> {t.cart.accessibility}
          </button>
        </div>
      </div>

    </div>
  );
}

// ─── BARIS ITEM KERANJANG ─────────────────────────────────────────────────────
function CartItemRow({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem;
  onUpdateQty: (cartId: string, qty: number) => void;
  onRemove: (cartId: string) => void;
}) {
  // Ditambahkan di sini agar komponen ini mengenali variabel 't'
  const { t } = useLanguage(); 

  // Ringkasan addon
  const addonSummary = item.addons
    ?.filter((x) => x.qty > 0)
    .map((x) => `Tambah ${x.qty} ${x.addon.name} (+${formatRp(x.addon.price * x.qty)})`)
    .join(", ");

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">

      {/* Tombol Hapus */}
      <button
        onClick={() => onRemove(item.cartId)}
        className="shrink-0 px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-black text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
      >
        {t.cart.delete} {/* Sekarang 't' sudah aman digunakan di sini */}
      </button>

      {/* Gambar */}
      <div className="w-14 h-14 relative shrink-0">
        <Image src={item.product.img} alt={item.product.name} fill className="object-contain" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-gray-900 leading-tight">{item.product.name}</p>
        {addonSummary && (
          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{addonSummary}</p>
        )}
        <p className="text-xs font-black text-[#C84C34] mt-1">{formatRp(item.totalPrice)}</p>
      </div>

      {/* Qty control */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onUpdateQty(item.cartId, item.qty - 1)}
          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-base font-black transition-all ${
            item.qty > 1 ? "border-gray-300 text-gray-700" : "border-gray-100 text-gray-300"
          }`}
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-bold text-gray-900">{item.qty}</span>
        <button
          onClick={() => onUpdateQty(item.cartId, item.qty + 1)}
          className="w-7 h-7 rounded-lg bg-[#C84C34] text-white flex items-center justify-center text-base font-black"
        >
          +
        </button>
      </div>

    </div>
  );
}