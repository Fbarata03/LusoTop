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

export interface Product {
  id: number;
  amount: number;
  currency: string;
  type: string;
}
