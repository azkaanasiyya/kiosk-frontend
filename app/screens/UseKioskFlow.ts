"use client";

import { useState, useCallback } from "react";
import { CartItem, Product } from "./types";

// ─── TIPE LAYAR ───────────────────────────────────────────────────────────────
// Diagram alur lengkap:
//
// menu ──[klik produk]──► detail ──[Tambah]──► success ──[1.5s]──► asal
//                                  [Batal]──► asal
//
// menu ──[Lihat Pesanan]──► recommendation ──[klik]──► detail
//                                            [Tidak]──► cart
//
// cart ──[Tambah Pesanan]──► menu
// cart ──[Selesaikan]──► payment
//
// payment ──[Bayar di Sini + dine in]────► pick-table ──► input-table ──► qris ──► receipt-paid
// payment ──[Bayar di Sini + take away]──► qris ──► receipt-paid
// payment ──[Bayar di Kasir + dine in]───► pick-table ──► input-table ──► receipt-pending
// payment ──[Bayar di Kasir + take away]─► receipt-pending
//
// receipt ──[Selesai / Cetak]──► reset ke menu awal
export type Screen =
  | "menu"
  | "detail"
  | "success"
  | "recommendation"
  | "cart"
  | "payment"
  | "pick-table"
  | "input-table"
  | "qris"
  | "receipt-paid"
  | "receipt-pending";

export type PaymentMethod = "qris" | "cashier" | null;
export type ServiceType   = "dine-in" | "take-away" | null;

// ─── HELPER: generate nomor order unik ───────────────────────────────────────
function generateOrderNumber(): string {
  const now   = new Date();
  const hhmm  = now.getHours().toString().padStart(2, "0") + now.getMinutes().toString().padStart(2, "0");
  const rand  = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `${hhmm}${rand}`;
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useKioskFlow(serviceType: ServiceType = null) {
  const [screen, setScreen]                   = useState<Screen>("menu");
  const [cart, setCart]                       = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [successTotal, setSuccessTotal]       = useState(0);
  const [afterSuccess, setAfterSuccess]       = useState<Screen>("menu");
  const [paymentMethod, setPaymentMethod]     = useState<PaymentMethod>(null);
  const [tableNumber, setTableNumber]         = useState<string | null>(null);
  const [orderNumber]                         = useState(() => generateOrderNumber());

  const isDineIn = serviceType === "dine-in";

  // ─── NAVIGASI ───────────────────────────────────────────────────────────────

  const goToDetail = useCallback((product: Product, returnTo: Screen = "menu") => {
    setSelectedProduct(product);
    setAfterSuccess(returnTo);
    setScreen("detail");
  }, []);

  const goBackFromDetail = useCallback(() => {
    setSelectedProduct(null);
    setScreen(afterSuccess);
  }, [afterSuccess]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const updated = [...prev, item];
      setSuccessTotal(updated.reduce((s, x) => s + x.totalPrice, 0));
      return updated;
    });
    setScreen("success");
  }, []);

  const onSuccessDone = useCallback(() => {
    setSelectedProduct(null);
    setScreen(afterSuccess);
  }, [afterSuccess]);

  const goToRecommendation = useCallback(() => setScreen("recommendation"), []);

  /** Dipanggil dari PaymentMethodPage saat user memilih metode bayar */
  const choosePaymentMethod = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
    if (isDineIn) {
      // Dine in → minta ambil & input nomor meja dulu
      setScreen("pick-table");
    } else {
      // Take away → langsung ke QRIS atau struk sementara
      setScreen(method === "qris" ? "qris" : "receipt-pending");
    }
  }, [isDineIn]);

  /** Dipanggil dari InputTableNumberPage setelah user input nomor meja */
  const confirmTableNumber = useCallback((number: string) => {
    setTableNumber(number);
    setScreen(paymentMethod === "qris" ? "qris" : "receipt-pending");
  }, [paymentMethod]);

  /** Dipanggil dari QRISPage setelah pembayaran berhasil */
  const onQRISPaid = useCallback(() => {
    setScreen("receipt-paid");
  }, []);

  /** Update qty item di keranjang (qty ≤ 0 = hapus) */
  const updateCartQty = useCallback((cartId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    } else {
      setCart((prev) =>
        prev.map((item) => {
          if (item.cartId !== cartId) return item;
          const addonExtra = item.addons.reduce((s, x) => s + x.addon.price * x.qty, 0);
          return { ...item, qty, totalPrice: (item.product.price + addonExtra) * qty };
        })
      );
    }
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  }, []);

  const resetAll = useCallback(() => {
    setCart([]);
    setSelectedProduct(null);
    setPaymentMethod(null);
    setTableNumber(null);
    setScreen("menu");
  }, []);

  // ─── COMPUTED ────────────────────────────────────────────────────────────────
  const cartTotal = cart.reduce((s, item) => s + item.totalPrice, 0);
  const cartQty   = cart.reduce((s, item) => s + item.qty, 0);

  return {
    // State
    screen,
    cart,
    cartTotal,
    cartQty,
    selectedProduct,
    successTotal,
    paymentMethod,
    tableNumber,
    orderNumber,

    // Navigasi
    goToDetail,
    goBackFromDetail,
    addToCart,
    onSuccessDone,
    goToRecommendation,
    choosePaymentMethod,
    confirmTableNumber,
    onQRISPaid,
    goToCart:        () => setScreen("cart"),
    goToPayment:     () => setScreen("payment"),
    goBackToCart:    () => setScreen("cart"),
    goBackToMenu:    () => setScreen("menu"),
    goToPickTable:   () => setScreen("pick-table"),
    goToInputTable:  () => setScreen("input-table"),

    // Keranjang
    updateCartQty,
    removeFromCart,
    resetAll,
  };
}