export type CountryStatus = "ACTIVE" | "COMING_SOON" | "DISABLED";

export interface Country {
  id: number;
  name: string;
  isoCode: string;
  phoneCode: string;
  currencyCode: string;
  currencySymbol: string;
  flagEmoji: string;
  status: CountryStatus;
}

export interface Operator {
  id: number;
  name: string;
  code: string;
  logoUrl: string | null;
  minAmount: number | null;
  maxAmount: number | null;
}

export type ProductType = "AIRTIME" | "DATA" | "VOICE";

export interface Product {
  id: number;
  amount: number;
  currency: string;
  type: ProductType;
  label: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthResult {
  token: string;
  user: User;
}
