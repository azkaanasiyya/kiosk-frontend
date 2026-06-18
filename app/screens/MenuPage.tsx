
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, RotateCcw, Accessibility } from "lucide-react";
import { CartItem, Product, formatRp } from "./types";
import { useLanguage } from "@/context/LanguageContext";
import { ApiProduct, ApiCategory } from "@/lib/api";

// ─── MAPPING ICON KATEGORI ────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<number, string> = {
  1:  "/signature-coffee-milk.png",
  2:  "/signature-coffee-milk.png",
  3:  "/signature-coffee-milk.png",
  4:  "/signature-coffee-milk.png",
  5:  "/signature-coffee-milk.png",
  6:  "/signature-coffee-milk.png",
  7:  "/tradisional.png",
  8:  "/pastry.png",
  9:  "/main-course.png",
  10: "/chicken-wings.png",
  11: "/snack.png",
  12: "/add-on.png",
};
const DEFAULT_CATEGORY_ICON = "/default.png";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:8000";

function normalizeImgUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : "/" + url;
  return `${LARAVEL_URL}${path}`;
}

function toProduct(p: ApiProduct): Product {
  return {
    id: p.product_id,
    product_id: p.product_id,
    name: p.name,
    price: p.base_price,
    img: normalizeImgUrl(p.img_url),
    subCatId: String(p.category_id),
    modifiers: p.modifiers,
    points: p.earning_points,
  };
}

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-gray-100" />
      <div className="p-1.5 flex flex-col gap-1">
        <div className="h-2.5 bg-gray-100 rounded w-3/4" />
        <div className="h-2 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── HALAMAN DEFAULT ──────────────────────────────────────────────────────────
function HomePage({
  favorites,
  loading,
  onSelectProduct,
}: {
  favorites: Product[];
  loading: boolean;
  onSelectProduct: (p: Product) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto no-scrollbar pb-28">
      <div className="bg-white px-4 pt-5 pb-3">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">{t.menu.orderNow}</h2>
      </div>

      <div className="mx-3 my-3 rounded-xl overflow-hidden relative h-24">
        <div className="w-full h-full bg-linear-to-r from-[#8B2E1A] to-[#C84C34]">
          <Image src="/banner.png" alt="Promo" fill className="object-cover" />
        </div>
      </div>

      <div className="bg-white px-3 pt-4 pb-4">
        <h3 className="text-lg font-black text-gray-900 tracking-tight mb-3">{t.menu.recommendations}</h3>
        <div className="grid grid-cols-3 gap-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            : favorites.length === 0
            ? (
              <div className="col-span-3 py-8 text-center text-gray-300">
                <p className="text-sm font-bold">Belum ada menu favorit</p>
              </div>
            )
            : favorites.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item)}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform flex flex-col"
                >
                  <div className="w-full aspect-square bg-gray-50">
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] font-bold text-gray-800 leading-tight line-clamp-2">{item.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{formatRp(item.price)}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

// ─── HALAMAN KATEGORI ─────────────────────────────────────────────────────────
function CategoryPage({
  category,
  products,
  loading,
  onSelectProduct,
}: {
  category: ApiCategory;
  products: Product[];
  loading: boolean;
  onSelectProduct: (p: Product) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [category.category_id]);

  return (
    <div ref={scrollContainerRef} className="flex-1 bg-white overflow-y-auto no-scrollbar pb-28">
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">{category.name}</h2>
        {category.description && (
          <p className="text-[10px] text-gray-400 mt-0.5">{category.description}</p>
        )}
      </div>

      <div className="px-3 pt-2">
        {loading ? (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-300">
            <p className="text-sm font-bold">Tidak ada produk</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform flex flex-col"
              >
                <div className="w-full aspect-square bg-gray-50">
                  <Image
                    src={product.img}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="p-1.5">
                  <p className="text-[10px] font-bold text-gray-800 leading-tight line-clamp-2">{product.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{formatRp(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MENU PAGE (export utama) ─────────────────────────────────────────────────
// Data menu (categories, products, favorites) sekarang di-fetch & di-cache
// di useAppFlow, MenuPage hanya menerima via props — tidak fetch sendiri.
export default function MenuPage({
  cart,
  onSelectProduct,
  onViewCart,
  onResetAll,
  savedCatId,
  onCatChange,
  categories,
  products,
  favorites,
  loading,
  error,
}: {
  cart: CartItem[];
  onSelectProduct: (p: Product) => void;
  onViewCart: () => void;
  onResetAll: () => void;
  savedCatId?: number | null;
  onCatChange?: (catId: number | null) => void;
  categories: ApiCategory[];
  products: ApiProduct[];
  favorites: Product[];
  loading: boolean;
  error: string | null;
}) {
  const { t } = useLanguage();

  const [activeCatId, setActiveCatId] = useState<number | null>(savedCatId ?? null);

  // Sync activeCatId setiap kali savedCatId dari parent berubah
  useEffect(() => {
    if (savedCatId !== undefined && savedCatId !== activeCatId) {
      setActiveCatId(savedCatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedCatId]);

  const activeCategory     = categories.find((c) => c.category_id === activeCatId) ?? null;
  const productsInCategory = products
    .filter((p) => p.category_id === activeCatId)
    .map(toProduct);
  const totalPrice = cart.reduce((s, item) => s + item.totalPrice, 0);
  const totalQty   = cart.reduce((s, item) => s + item.qty, 0);

  if (error) {
    return (
      <div className="w-screen h-screen bg-white flex flex-col items-center justify-center gap-4 font-sans">
        <p className="text-sm font-bold text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#C84C34] text-white rounded-xl text-sm font-black"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-white overflow-hidden">
      <main className="relative w-full h-full bg-white flex flex-col font-sans">
        <div className="flex-1 flex overflow-hidden">

          {/* SIDEBAR KIRI */}
          <aside className="w-[30%] bg-white border-r border-gray-100 flex flex-col overflow-y-auto no-scrollbar shrink-0 min-h-0 h-full pb-28">
            <div className="bg-[#C84C34] w-full aspect-square shrink-0 relative">
              <Image src="/kopjay-logo.png" alt="kopi jaya" fill className="object-cover" />
            </div>
            <nav className="flex flex-col flex-1">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-full px-3 py-4 border-b border-gray-100 animate-pulse">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </div>
                  ))
                : categories.map((cat) => (
                    <button
                      key={cat.category_id}
                      onClick={() => {
                        setActiveCatId(cat.category_id);
                        onCatChange?.(cat.category_id);
                      }}
                      className={`w-full px-3 py-3 flex flex-row items-center gap-2 border-b border-gray-100 transition-all text-left ${
                        activeCatId === cat.category_id
                          ? "bg-white border-l-4 border-[#C84C34]"
                          : "opacity-50 grayscale border-l-4 border-transparent"
                      }`}
                    >
                      <Image
                        src={CATEGORY_ICONS[cat.category_id] ?? DEFAULT_CATEGORY_ICON}
                        alt={cat.name}
                        width={20}
                        height={20}
                        className="object-contain shrink-0"
                      />
                      <span className="text-[11px] font-bold leading-tight text-gray-800">{cat.name}</span>
                    </button>
                  ))}
            </nav>
          </aside>

          {/* KONTEN KANAN */}
          {activeCategory === null ? (
            <HomePage
              favorites={favorites}
              loading={loading}
              onSelectProduct={onSelectProduct}
            />
          ) : (
            <CategoryPage
              category={activeCategory}
              products={productsInCategory}
              loading={loading}
              onSelectProduct={onSelectProduct}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart size={22} className="text-[#C84C34]" />
                {totalQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {totalQty}
                  </span>
                )}
              </div>
              <span className="text-lg font-black text-gray-900">{formatRp(totalPrice)}</span>
            </div>
            <button
              onClick={onViewCart}
              className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
                totalQty > 0
                  ? "bg-[#C84C34] text-white shadow-md"
                  : "bg-[#C84C34]/30 text-[#C84C34]/60"
              }`}
            >
              {t.menu.viewOrder}
            </button>
          </div>

          <div className="flex items-center justify-between px-4 pb-3 gap-3">
            <button
              onClick={onResetAll}
              className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0"
            >
              <RotateCcw size={11} /> {t.menu.restartOrder}
            </button>
            <p className="text-[7.5px] text-gray-400 leading-tight text-right flex-1">
              {t.menu.halalNote}
            </p>
            <button className="text-[9px] font-black uppercase flex items-center gap-1 text-gray-500 shrink-0">
              <Accessibility size={11} /> {t.menu.accessibility}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

