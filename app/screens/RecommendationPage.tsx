"use client";

import React from "react";
import Image from "next/image";
import { Product, formatRp } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export default function RecommendationPage({
  favorites,
  onSelectProduct,
  onSkip,
}: {
  favorites: Product[];
  onSelectProduct: (p: Product) => void;
  onSkip: () => void;
}) {
  const { t } = useLanguage();

  // Ambil maksimal 5 produk untuk ditampilkan (layout: baris 3 + baris 2)
  const displayed = favorites.slice(0, 5);

  // Kalau tidak ada favorit sama sekali, langsung skip ke cart
  if (displayed.length === 0) {
    return (
      <div className="w-screen h-screen bg-white flex flex-col items-center justify-center font-sans px-6 gap-6">
        <h2 className="text-2xl font-black text-gray-900 text-center leading-snug">
          {t.recommendation.title}
        </h2>
        <p className="text-sm text-gray-400 text-center">Belum ada rekomendasi tersedia.</p>
        <button
          onClick={onSkip}
          className="w-full py-4 bg-[#C84C34] rounded-2xl text-sm font-black text-white shadow-md"
        >
          {t.recommendation.skip}
        </button>
      </div>
    );
  }

  const firstRow  = displayed.slice(0, 3);
  const secondRow = displayed.slice(3, 5);

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center font-sans px-6 gap-8">

      {/* Judul */}
      <h2 className="text-2xl font-black text-gray-900 text-center leading-snug">
        {t.recommendation.title}
      </h2>

      {/* Grid rekomendasi */}
      <div className="w-full flex flex-col gap-3">

        {/* Baris pertama: maks 3 kolom */}
        <div className="grid grid-cols-3 gap-3">
          {firstRow.map((item) => (
            <ProductCard key={item.id} product={item} onSelect={onSelectProduct} />
          ))}
        </div>

        {/* Baris kedua: maks 2 kolom, center */}
        {secondRow.length > 0 && (
          <div className="flex justify-center gap-3">
            {secondRow.map((item) => (
              <div key={item.id} className="w-[calc(33.333%-6px)]">
                <ProductCard product={item} onSelect={onSelectProduct} />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Tombol Skip */}
      <button
        onClick={onSkip}
        className="w-full py-4 border border-gray-200 rounded-2xl text-sm font-black text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {t.recommendation.skip}
      </button>

    </div>
  );
}

// ─── CARD PRODUK ──────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (p: Product) => void;
}) {
  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform flex flex-col"
    >
      <div className="w-full aspect-square bg-gray-50">
        <Image
          src={product.img}
          alt={product.name}
          width={120}
          height={120}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="p-2">
        <p className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2">{product.name}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{formatRp(product.price)}</p>
      </div>
    </div>
  );
}