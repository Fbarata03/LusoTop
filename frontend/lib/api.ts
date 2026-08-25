import { z } from "zod";
import type { AuthResult, Country, Operator, Product, User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

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

  const data = await response.json();
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
