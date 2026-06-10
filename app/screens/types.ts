// app/screens/types.ts
// ─── TIPE DATA ────────────────────────────────────────────────────────────────

import type { ApiModifierGroup, ApiModifierOption } from "@/lib/api";

// Re-export agar komponen lain bisa import dari sini
export type { ApiModifierGroup, ApiModifierOption };

export type Addon = {
  id: string;
  name: string;
  price: number;
  img: string;
};

export type Product = {
  id: number;
  product_id?: number;        // id asli dari database (sama dengan id setelah integrasi)
  name: string;
  price: number;
  img: string;
  subCatId: string;
  addons?: Addon[];           // legacy — tidak dipakai setelah integrasi
  modifiers?: ApiModifierGroup[] | null; // modifier dari backend
  points?: number;            // earning_points dari backend
};

// Info member yang login
export type MemberInfo =
  | { type: "guest" }
  | { type: "member"; phone: string; name: string; member_id?: number };

export type SubCategory = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  img: string;
  subCategories: SubCategory[];
  products: Product[];
};

export type SelectedAddon = {
  addon: Addon;
  qty: number;
};

// Modifier yang dipilih user (dari ApiModifierOption)
export type SelectedModifier = {
  modifier_id: number;
  name: string;
  extra_price: number;
  group_name: string;
};

export type CartItem = {
  cartId: string;
  product: Product;
  qty: number;
  addons: SelectedAddon[];        // legacy, kosong setelah integrasi
  modifiers?: SelectedModifier[]; // modifier yang dipilih dari backend
  totalPrice: number;
};

// ─── HELPER ───────────────────────────────────────────────────────────────────
export function formatRp(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

// ─── DATA DUMMY (fallback jika API belum tersedia) ────────────────────────────

export const RECOMMENDATIONS: Product[] = [];
export const CATEGORIES: Category[] = [];