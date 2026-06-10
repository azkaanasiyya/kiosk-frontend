// lib/api.ts
// ─── PUSAT SEMUA API CALL KE LARAVEL BACKEND ─────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const KIOSK_KEY = process.env.NEXT_PUBLIC_KIOSK_KEY!;

const defaultHeaders = {
  "Content-Type": "application/json",
  "X-Kiosk-Key": KIOSK_KEY,
};

// ─── HELPER FETCH ─────────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...defaultHeaders, ...options?.headers },
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `API Error ${res.status}`);
  }

  return json.data as T;
}

// ─── TIPE RESPONSE API ────────────────────────────────────────────────────────

export type ApiModifierOption = {
  modifier_id: number;
  name: string;
  extra_price: number;
  type: "add" | "remove";
};

export type ApiModifierGroup = {
  group_name: string;
  selection_type: "single" | "multiple";
  options: ApiModifierOption[];
};

export type ApiProduct = {
  product_id: number;
  category_id: number;
  category_name: string;
  name: string;
  description: string;
  base_price: number;
  img_url: string | null;
  earning_points: number;
  is_favorite: boolean;
  modifiers: ApiModifierGroup[] | null;
};

export type ApiCategory = {
  category_id: number;
  name: string;
  description: string;
};

export type ApiMember = {
  member_id: number;
  name: string;
  phone_number: string;
  tier: string;
  current_points: number;
};

export type ApiTax = {
  tax_id: number;
  name: string;
  rate: number;
};

export type ApiServiceCharge = {
  service_charge_id: number;
  name: string;
  rate: number;
};

export type ApiConfig = {
  outlet_id: number;
  tax: ApiTax | null;
  service_charge: ApiServiceCharge | null;
};

export type ApiOrderItem = {
  product_id: number;
  quantity: number;
  notes?: string;
  modifiers: { modifier_id: number }[];
};

export type ApiOrderResponse = {
  order_id: number;
  status: string;
  subtotal: number;
  tax: number;
  service: number;
  total_final: number;
};

export type ApiPaymentQrisResponse = {
  order_id: number;
  payment_id: number;
  qr_string: string;
  qr_url: string;
  amount: number;
  expired_at: string;
};

export type ApiPaymentStatus = {
  order_id: number;
  order_status: string;
  payment_status: "pending" | "success" | "failed" | "expired" | "no_payment";
};

export type ApiReceiptItem = {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  modifiers: { name: string; extra_price: number }[];
  notes: string | null;
};

export type ApiReceipt = {
  order_id: number;
  order_type: string;
  table_number: string | null;
  status: string;
  member: ApiMember | null;
  items: ApiReceiptItem[];
  subtotal: number;
  tax: { name: string; rate: number } | null;
  service_charge: { name: string; rate: number } | null;
  total_final: number;
  payment: {
    payment_method: string;
    status: string;
    amount: number;
    paid_at: string | null;
  } | null;
  created_at: string;
};

// ─── API FUNCTIONS ────────────────────────────────────────────────────────────

/** Ambil konfigurasi outlet (tax, service charge) */
export async function fetchConfig(): Promise<ApiConfig> {
  return apiFetch<ApiConfig>("/kiosk/config");
}

/** Lookup member by nomor HP */
export async function lookupMember(phone: string): Promise<ApiMember> {
  return apiFetch<ApiMember>("/kiosk/member/lookup", {
    method: "POST",
    body: JSON.stringify({ phone_number: phone }),
  });
}

/** Ambil semua produk beserta modifier-nya */
export async function fetchProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>("/kiosk/products");
}

/** Ambil semua kategori */
export async function fetchCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>("/kiosk/categories");
}

/** Ambil produk favorit outlet */
export async function fetchFavorites(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>("/kiosk/favorites");
}

/** Buat order baru */
export async function createOrder(payload: {
  order_type: "dine-in" | "takeaway";
  member_id?: number;
  table_number?: string;
  items: ApiOrderItem[];
}): Promise<ApiOrderResponse> {
  return apiFetch<ApiOrderResponse>("/kiosk/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Buat pembayaran QRIS via Midtrans */
export async function createQrisPayment(
  orderId: number
): Promise<ApiPaymentQrisResponse> {
  return apiFetch<ApiPaymentQrisResponse>(
    `/kiosk/orders/${orderId}/payment/qris`,
    { method: "POST" }
  );
}

/** Pilih bayar di kasir */
export async function payAtCashier(orderId: number): Promise<void> {
  await apiFetch(`/kiosk/orders/${orderId}/payment/kasir`, {
    method: "POST",
  });
}

/** Polling status pembayaran */
export async function fetchPaymentStatus(
  orderId: number
): Promise<ApiPaymentStatus> {
  return apiFetch<ApiPaymentStatus>(
    `/kiosk/orders/${orderId}/payment/status`
  );
}

/** Ambil data struk lengkap */
export async function fetchReceipt(orderId: number): Promise<ApiReceipt> {
  return apiFetch<ApiReceipt>(`/kiosk/orders/${orderId}/receipt`);
}