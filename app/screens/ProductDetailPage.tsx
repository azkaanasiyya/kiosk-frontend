"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CartItem, Product, SelectedAddon, formatRp } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
}: {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const { t } = useLanguage();
  const [qty, setQty] = useState(1);
  const [addonQtys, setAddonQtys] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    (product.addons ?? []).forEach((a) => { map[a.id] = 0; });
    return map;
  });

  const changeAddonQty = (id: string, delta: number) => {
    setAddonQtys((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  };

  const resetAddons = () => {
    const reset: Record<string, number> = {};
    (product.addons ?? []).forEach((a) => { reset[a.id] = 0; });
    setAddonQtys(reset);
  };

  // Hitung total
  const selectedAddons: SelectedAddon[] = (product.addons ?? [])
    .map((a) => ({ addon: a, qty: addonQtys[a.id] ?? 0 }))
    .filter((x) => x.qty > 0);

  const addonExtra  = selectedAddons.reduce((s, x) => s + x.addon.price * x.qty, 0);
  const totalHarga  = (product.price + addonExtra) * qty;
  const hasAddons   = (product.addons ?? []).length > 0;
  const hasSelected = selectedAddons.length > 0;

  const handleTambah = () => {
    onAddToCart({
      // eslint-disable-next-line react-hooks/purity
      cartId: `${product.id}-${Date.now()}`,
      product,
      qty,
      addons: selectedAddons,
      totalPrice: totalHarga,
    });
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col font-sans">

      {/* ── KONTEN SCROLL ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">

        {/* Gambar produk */}
        <div className="w-full bg-gray-50 flex items-center justify-center py-12">
          <div className="relative w-56 h-56">
            <Image src={product.img} alt={product.name} fill className="object-contain" />
          </div>
        </div>

        <div className="px-5 pt-4 flex flex-col gap-4">

          {/* ── INFO PRODUK ──────────────────────────────────────────────── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4 text-center">
            <h2 className="text-xl font-black text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{formatRp(product.price)}</p>

            {/* Qty control */}
            <div className="flex items-center mt-4 gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl font-black transition-all ${
                  qty > 1 ? "border-gray-300 text-gray-700" : "border-gray-100 text-gray-300"
                }`}
              >
                −
              </button>
              <span className="flex-1 text-center text-2xl font-black text-gray-900">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-12 h-12 rounded-xl bg-[#C84C34] text-white flex items-center justify-center text-xl font-black shadow-md"
              >
                +
              </button>
            </div>
          </div>

          {/* ── MODIFIKASI / ADDON ───────────────────────────────────────── */}
          {hasAddons && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Header section modifikasi */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <h3 className="text-sm font-black text-gray-900">{t.productDetail.additionalItems}</h3>
                {hasSelected && (
                  <button
                    onClick={resetAddons}
                    className="text-[10px] font-bold text-[#C84C34] border border-[#C84C34]/30 px-2.5 py-1 rounded-full"
                  >
                    {t.productDetail.removeAll}
                  </button>
                )}
              </div>

              {/* Daftar addon */}
              {(product.addons ?? []).map((addon, idx) => (
                <div
                  key={addon.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    idx < (product.addons ?? []).length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  {/* <div className="w-10 h-10 relative shrink-0">
                    <Image src={addon.img} alt={addon.name} fill className="object-contain" />
                  </div> */}
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800">{addon.name}</p>
                    {addon.price > 0 && (
                      <p className="text-[10px] text-gray-400">+{formatRp(addon.price)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeAddonQty(addon.id, -1)}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center text-lg font-black transition-all ${
                        (addonQtys[addon.id] ?? 0) > 0
                          ? "border-gray-300 text-gray-700"
                          : "border-gray-100 text-gray-300"
                      }`}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-bold text-gray-900">
                      {addonQtys[addon.id] ?? 0}
                    </span>
                    <button
                      onClick={() => changeAddonQty(addon.id, 1)}
                      className="w-8 h-8 rounded-lg bg-[#C84C34] text-white flex items-center justify-center text-lg font-black"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              {/* Ringkasan addon yang dipilih */}
              {hasSelected && (
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    <span className="font-bold text-gray-700">{t.productDetail.yourChanges}: </span>
                    {selectedAddons
                      .map((x) => `${x.qty}x ${x.addon.name}${x.addon.price > 0 ? ` (+${formatRp(x.addon.price * x.qty)})` : ""}`)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-t border-gray-100 px-5 py-4">
        {/* Total harga (hanya tampil jika ada addon berbayar) */}
        {addonExtra > 0 && (
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-xs text-gray-500 font-bold">{t.productDetail.total}</span>
            <span className="text-base font-black text-gray-900">{formatRp(totalHarga)}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm font-black text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t.productDetail.cancel}
          </button>
          <button
            onClick={handleTambah}
            className="flex-2 py-3.5 bg-[#C84C34] rounded-xl text-sm font-black text-white shadow-md"
          >
            {t.productDetail.addToOrder}
          </button>
        </div>
      </div>

    </div>
  );
}