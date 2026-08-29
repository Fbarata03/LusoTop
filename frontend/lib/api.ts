import { z } from "zod";
import type { AuthResult, Country, Operator, OrderSummary, Product, User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const TOKEN_KEY = "lusotop_token";

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const countrySchema = z.object({
  id: z.number(),
  name: z.string(),
  isoCode: z.string(),
  phoneCode: z.string(),
  currencyCode: z.string(),
  currencySymbol: z.string(),
  flagEmoji: z.string(),
  status: z.enum(["ACTIVE", "COMING_SOON", "DISABLED"]),
});

const operatorSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  logoUrl: z.string().nullable(),
  minAmount: z.number().nullable(),
  maxAmount: z.number().nullable(),
});

const productSchema = z.object({
  id: z.number(),
  amount: z.number(),
  currency: z.string(),
  type: z.enum(["AIRTIME", "DATA", "VOICE"]),
  label: z.string().nullable(),
  payerAmountEur: z.number().nullable(),
});

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["USER", "ADMIN"]),
});

const authResultSchema = z.object({
  token: z.string(),
  user: userSchema,
});

const rateSchema = z.object({
  from: z.string(),
  to: z.string(),
  available: z.boolean(),
  rate: z.number().nullable(),
});
export type ExchangeRate = z.infer<typeof rateSchema>;

const createOrderResponseSchema = z.object({
  orderId: z.number(),
  checkoutUrl: z.string(),
});

const orderSummarySchema = z.object({
  id: z.number(),
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
  deliveryStatus: z.enum(["PENDING", "DELIVERED", "FAILED"]),
  refunded: z.boolean(),
  countryName: z.string(),
  countryIso: z.string(),
  operatorName: z.string(),
  operatorLogoUrl: z.string().nullable(),
  phoneNumber: z.string(),
  productAmount: z.number(),
  productCurrency: z.string(),
  payerAmount: z.number(),
  payerCurrency: z.string(),
  createdAt: z.string(),
});

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(
      "Não foi possível ligar ao servidor. Verifique se a API está a correr."
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(body?.message ?? `Erro ao contactar a API (${response.status}).`);
  }

  const data = response.status === 204 ? undefined : await response.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("Resposta inesperada da API.");
  }
  return parsed.data;
}

export function fetchCountries(): Promise<Country[]> {
  return request("/api/countries", z.array(countrySchema));
}

export function fetchOperatorsByCountry(isoCode: string): Promise<Operator[]> {
  return request(
    `/api/countries/${encodeURIComponent(isoCode)}/operators`,
    z.array(operatorSchema)
  );
}

export function fetchProductsByOperator(operatorId: number): Promise<Product[]> {
  return request(
    `/api/operators/${operatorId}/products`,
    z.array(productSchema)
  );
}

export function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  return request("/api/auth/register", authResultSchema, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser(email: string, password: string): Promise<AuthResult> {
  return request("/api/auth/login", authResultSchema, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function loginWithGoogle(idToken: string): Promise<AuthResult> {
  return request("/api/auth/google", authResultSchema, {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export function forgotPassword(email: string): Promise<void> {
  return request("/api/auth/forgot-password", z.unknown(), {
    method: "POST",
    body: JSON.stringify({ email }),
  }).then(() => undefined);
}

export function resetPassword(token: string, newPassword: string): Promise<void> {
  return request("/api/auth/reset-password", z.unknown(), {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  }).then(() => undefined);
}

export function fetchMe(token: string): Promise<User> {
  return request("/api/auth/me", userSchema, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchExchangeRate(from: string, to: string): Promise<ExchangeRate> {
  return request(
    `/api/currency/rate?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    rateSchema
  );
}

export function createOrder(payload: {
  countryIso: string;
  operatorId: number;
  productId: number;
  phoneNumber: string;
}): Promise<{ orderId: number; checkoutUrl: string }> {
  return request("/api/orders", createOrderResponseSchema, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export function confirmOrder(sessionId: string): Promise<OrderSummary> {
  return request(
    `/api/orders/session/${encodeURIComponent(sessionId)}`,
    orderSummarySchema
  );
}

export function fetchMyOrders(): Promise<OrderSummary[]> {
  return request("/api/orders/mine", z.array(orderSummarySchema), {
    headers: authHeaders(),
  });
}

export async function downloadReceipt(orderId: number): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/orders/${orderId}/receipt`, {
      headers: authHeaders(),
    });
  } catch {
    throw new ApiError("Não foi possível ligar ao servidor.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(body?.message ?? "Não foi possível obter o comprovativo.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lusotop-comprovativo-${orderId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const adminDashboardSchema = z.object({
  totalCustomers: z.number(),
  totalOrders: z.number(),
  deliveredOrders: z.number(),
  pendingDeliveryOrders: z.number(),
  failedDeliveryOrders: z.number(),
  paidOrders: z.number(),
  failedPayments: z.number(),
  totalRevenueEur: z.number(),
  grossMarginEur: z.number(),
  ordersToday: z.number(),
  ordersThisMonth: z.number(),
});
export type AdminDashboard = z.infer<typeof adminDashboardSchema>;

const adminOrderSchema = z.object({
  id: z.number(),
  customerName: z.string().nullable(),
  customerEmail: z.string().nullable(),
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]),
  deliveryStatus: z.enum(["PENDING", "DELIVERED", "FAILED"]),
  refunded: z.boolean(),
  countryName: z.string(),
  operatorName: z.string(),
  phoneNumber: z.string(),
  payerAmount: z.number(),
  payerCurrency: z.string(),
  stripePaymentIntentId: z.string().nullable(),
  dingconnectTransferRef: z.string().nullable(),
  deliveryError: z.string().nullable(),
  createdAt: z.string(),
});
export type AdminOrder = z.infer<typeof adminOrderSchema>;

const adminCustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  orderCount: z.number(),
  totalSpentEur: z.number(),
  lastActivity: z.string(),
});
export type AdminCustomer = z.infer<typeof adminCustomerSchema>;

export function fetchAdminDashboard(): Promise<AdminDashboard> {
  return request("/api/admin/dashboard", adminDashboardSchema, { headers: authHeaders() });
}

export function fetchAdminOrders(): Promise<AdminOrder[]> {
  return request("/api/admin/orders", z.array(adminOrderSchema), { headers: authHeaders() });
}

export function fetchAdminCustomers(): Promise<AdminCustomer[]> {
  return request("/api/admin/customers", z.array(adminCustomerSchema), { headers: authHeaders() });
}

const notificationSchema = z.object({
  id: z.number(),
  type: z.enum(["RECHARGE_DELIVERED", "RECHARGE_FAILED"]),
  title: z.string(),
  message: z.string(),
  read: z.boolean(),
  orderId: z.number().nullable(),
  createdAt: z.string(),
});
export type NotificationItem = z.infer<typeof notificationSchema>;

export function fetchMyNotifications(): Promise<NotificationItem[]> {
  return request("/api/notifications/mine", z.array(notificationSchema), { headers: authHeaders() });
}

export function fetchUnreadNotificationCount(): Promise<number> {
  return request("/api/notifications/unread-count", z.object({ unread: z.number() }), {
    headers: authHeaders(),
  }).then((r) => r.unread);
}

export function markNotificationRead(id: number): Promise<void> {
  return request(`/api/notifications/${id}/read`, z.unknown(), {
    method: "POST",
    headers: authHeaders(),
  }).then(() => undefined);
}

export function markAllNotificationsRead(): Promise<void> {
  return request("/api/notifications/read-all", z.unknown(), {
    method: "POST",
    headers: authHeaders(),
  }).then(() => undefined);
}
