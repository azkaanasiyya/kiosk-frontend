"use client";

import { useState, useCallback, useEffect } from "react";
import { CartItem, Product, MemberInfo } from "./screens/types";
import {
  fetchConfig,
  createOrder,
  payAtCashier,
  ApiConfig,
  ApiProduct,
} from "@/lib/api";

export type AppScreen =
  | "start"
  | "service-type"
  | "member"
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

export type ServiceType   = "dine-in" | "take-away" | null;
export type PaymentMethod = "qris" | "cashier" | null;

function generateOrderNumber(): string {
  const now  = new Date();
  const hhmm = now.getHours().toString().padStart(2, "0") + now.getMinutes().toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `${hhmm}${rand}`;
}

// ─── HELPER: konversi ApiProduct → Product ────────────────────────────────────
const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:8000";

function normalizeImgUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : "/" + url;
  return `${LARAVEL_URL}${path}`;
}

export function apiProductToProduct(p: ApiProduct): Product {
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

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useAppFlow() {
  const [screen, setScreen]                   = useState<AppScreen>("start");
  const [serviceType, setServiceType]         = useState<ServiceType>(null);
  const [member, setMember]                   = useState<MemberInfo>({ type: "guest" });
  const [cart, setCart]                       = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [successTotal, setSuccessTotal]       = useState(0);
  const [afterSuccess, setAfterSuccess]       = useState<AppScreen>("menu");
  const [paymentMethod, setPaymentMethod]     = useState<PaymentMethod>(null);
  const [tableNumber, setTableNumber]         = useState<string | null>(null);
  const [orderNumber, setOrderNumber]         = useState(() => generateOrderNumber());

  // ─── STATE BERHASIL DIGABUNGKAN ─────────────────────────────────────────────
  const [savedCatId, setSavedCatId]           = useState<number | null>(null); // ← Tambahan dari kode kedua
  const [orderId, setOrderId]                 = useState<number | null>(null);
  const [kioskConfig, setKioskConfig]         = useState<ApiConfig | null>(null);
  const [orderError, setOrderError]           = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [favorites, setFavorites]             = useState<Product[]>([]);
  const [menuLoaded, setMenuLoaded]           = useState(false);

  // Fetch kiosk config sekali saat app load
  useEffect(() => {
    fetchConfig()
      .then(setKioskConfig)
      .catch((err) => console.error("Gagal fetch config:", err));
  }, []);

  // ─── COMPUTED ──────────────────────────────────────────────────────────────
  const cartTotal = cart.reduce((s, item) => s + item.totalPrice, 0);
  const cartQty   = cart.reduce((s, item) => s + item.qty, 0);
  const isDineIn  = serviceType === "dine-in";
  const isMember  = member.type === "member";

  const totalPoints = isMember
    ? cart.reduce((s, item) => s + (item.product.points ?? 0) * item.qty, 0)
    : 0;

  // ─── NAVIGASI ──────────────────────────────────────────────────────────────
  const goToServiceType = useCallback(() => setScreen("service-type"), []);

  const chooseServiceType = useCallback((type: ServiceType) => {
    setServiceType(type);
    setScreen("member");
  }, []);

  const setMemberAndContinue = useCallback((info: MemberInfo) => {
    setMember(info);
    setScreen("menu");
  }, []);

  const goToDetail = useCallback((product: Product, returnTo: AppScreen = "menu") => {
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
  const goToCart           = useCallback(() => setScreen("cart"), []);
  const goToPayment = useCallback(() => setScreen("payment"), []);
  const goToInputTable     = useCallback(() => setScreen("input-table"), []);

  // ─── SUBMIT ORDER KE BACKEND ───────────────────────────────────────────────
  const submitOrder = useCallback(async (
    method: "qris" | "cashier",
    tableNum: string | null
  ) => {
    setIsSubmitting(true);
    setOrderError(null);

    try {
      const memberInfo = member as { type: string; member_id?: number };
      const memberId   = memberInfo.type === "member" ? memberInfo.member_id : undefined;

      const order = await createOrder({
        order_type: isDineIn ? "dine-in" : "takeaway",
        ...(memberId && { member_id: memberId }),
        ...(tableNum && { table_number: tableNum }),
        items: cart.map((item) => ({
          product_id: item.product.product_id ?? item.product.id,
          quantity: item.qty,
          modifiers: (item.modifiers ?? []).map((m) => ({
            modifier_id: m.modifier_id,
          })),
        })),
      });

      setOrderId(order.order_id);

      if (method === "cashier") {
        await payAtCashier(order.order_id);
        setScreen("receipt-pending");
      } else {
        setScreen("qris");
      }
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Terjadi kesalahan saat membuat order");
    } finally {
      setIsSubmitting(false);
    }
  }, [cart, member, isDineIn]);

  const choosePaymentMethod = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
    if (isDineIn) {
      setScreen("pick-table");
    } else {
      submitOrder(method ?? "cashier", null);
    }
  }, [isDineIn, submitOrder]);

  const confirmTableNumber = useCallback((number: string) => {
    setTableNumber(number);
    submitOrder(paymentMethod ?? "cashier", number);
  }, [paymentMethod, submitOrder]);

  const onQRISPaid = useCallback(() => setScreen("receipt-paid"), []);

  const updateCartQty = useCallback((cartId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    } else {
      setCart((prev) =>
        prev.map((item) => {
          if (item.cartId !== cartId) return item;
          const modifierExtra = (item.modifiers ?? []).reduce((s, m) => s + m.extra_price, 0);
          const addonExtra    = item.addons.reduce((s, x) => s + x.addon.price * x.qty, 0);
          return { ...item, qty, totalPrice: (item.product.price + modifierExtra + addonExtra) * qty };
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
    setServiceType(null);
    setMember({ type: "guest" });
    setPaymentMethod(null);
    setTableNumber(null);
    setOrderId(null);
    setOrderError(null);
    setSavedCatId(null); // ← Turut di-reset saat kiosk kembali ke layar start
    setMenuLoaded(false);
    setOrderNumber(generateOrderNumber());
    setScreen("start");
  }, []);

  return {
    // State
    screen,
    serviceType,
    member,
    isMember,
    cart,
    cartTotal,
    cartQty,
    totalPoints,
    selectedProduct,
    successTotal,
    paymentMethod,
    tableNumber,
    orderNumber,
    orderId,
    kioskConfig,
    orderError,
    isSubmitting,
    favorites,
    savedCatId,          // Bakal dipakai MenuPage untuk mengunci tab aktif

    // Navigasi
    goToServiceType,
    chooseServiceType,
    setMemberAndContinue,
    goToDetail,
    goBackFromDetail,
    addToCart,
    onSuccessDone,
    goToRecommendation,
    goToCart,
    goToPayment,
    choosePaymentMethod,
    goToInputTable,
    confirmTableNumber,
    onQRISPaid,
    goBackToCart: () => setScreen("cart"),
    goBackToMenu: () => setScreen("menu"),

    // Keranjang
    updateCartQty,
    removeFromCart,
    resetAll,

    // Setters
    setFavorites,
    setSavedCatId,
    menuLoaded,
    setMenuLoaded,       // Diexport juga agar MenuPage bisa mengubah nilainya
  };
}