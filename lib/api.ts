// lib/api.ts
const BASE_URL  = process.env.NEXT_PUBLIC_API_URL!;
const KIOSK_KEY = process.env.NEXT_PUBLIC_KIOSK_KEY!;

const defaultHeaders = {
  "Content-Type": "application/json",
  "X-Kiosk-Key": KIOSK_KEY,
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res  = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...defaultHeaders, ...options?.headers },
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `API Error ${res.status}`);
  }
  return json.data as T;
}

// ─── TIPE RESPONSE ───────────────────────────────────────────────────────────

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
  modifiers: ApiModifierGroup[];
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

export type ApiTaxConfig = {
  tax_id: number;
  name: string;
  type: "percentage" | "nominal";
  value: number;
};

export type ApiServiceChargeConfig = {
  service_charge_id: number;
  name: string;
  type: "percentage" | "nominal";
  value: number; 
};

export type ApiConfig = {
  outlet_id: number;
  tax: ApiTaxConfig | null;
  service_charge: ApiServiceChargeConfig | null;
};

export type ApiOrderItem = {
  product_id: number;
  quantity: number;
  notes?: string;
  modifiers: { modifier_id: number }[];
};

export type ApiOrderResponse = {
  order_id: number;
  pickup_code?: string;
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
  payment_url: string;
  amount: number;
  expired_at: string;
};

export type ApiPaymentStatus = {
  order_id: number;
  order_status: string;
  payment_status: "pending" | "success" | "failed" | "expired" | "no_payment";
};

export type ApiReceipt = {
  order_id: number;
  order_type: string;
  table_number: string | null;
  status: string;
  member: ApiMember | null;
  items: {
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    modifiers: { name: string; extra_price: number }[];
    notes: string | null;
  }[];
  subtotal: number;
  tax: { name: string; type: string; value: number } | null;
  service_charge: { name: string; type: string; value: number } | null;
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

export async function fetchConfig(): Promise<ApiConfig> {
  return apiFetch<ApiConfig>("/kiosk/config");
}

export async function lookupMember(phone: string): Promise<ApiMember> {
  return apiFetch<ApiMember>("/kiosk/member/lookup", {
    method: "POST",
    body: JSON.stringify({ phone_number: phone }),
  });
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>("/kiosk/products");
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>("/kiosk/categories");
}

export async function fetchFavorites(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>("/kiosk/favorites");
}

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

export async function createQrisPayment(orderId: number): Promise<ApiPaymentQrisResponse> {
  return apiFetch<ApiPaymentQrisResponse>(`/kiosk/orders/${orderId}/payment/qris`, {
    method: "POST",
  });
}

export async function payAtCashier(orderId: number): Promise<void> {
  await apiFetch(`/kiosk/orders/${orderId}/payment/kasir`, { method: "POST" });
}

export async function setPickupCode(orderId: number, pickupCode: string): Promise<void> {
  await apiFetch(`/kiosk/orders/${orderId}/pickup-code`, {
    method: "PATCH",
    body: JSON.stringify({ pickup_code: pickupCode }),
  });
}

export async function fetchPaymentStatus(orderId: number): Promise<ApiPaymentStatus> {
  return apiFetch<ApiPaymentStatus>(`/kiosk/orders/${orderId}/payment/status`);
}

export async function fetchReceipt(orderId: number): Promise<ApiReceipt> {
  return apiFetch<ApiReceipt>(`/kiosk/orders/${orderId}/receipt`);
}