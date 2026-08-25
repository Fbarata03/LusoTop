import { z } from "zod";
import type { Country, Operator, Product } from "./types";

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
  type: z.string(),
});

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function getJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new ApiError(
      "Não foi possível ligar ao servidor. Verifique se a API está a correr."
    );
  }

  if (!response.ok) {
    throw new ApiError(`Erro ao contactar a API (${response.status}).`);
  }

  const data = await response.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("Resposta inesperada da API.");
  }
  return parsed.data;
}

export function fetchCountries(): Promise<Country[]> {
  return getJson("/api/countries", z.array(countrySchema));
}

export function fetchOperatorsByCountry(isoCode: string): Promise<Operator[]> {
  return getJson(
    `/api/countries/${encodeURIComponent(isoCode)}/operators`,
    z.array(operatorSchema)
  );
}

export function fetchProductsByOperator(operatorId: number): Promise<Product[]> {
  return getJson(
    `/api/operators/${operatorId}/products`,
    z.array(productSchema)
  );
}
