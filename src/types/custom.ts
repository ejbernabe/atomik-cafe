import { type Database } from "./database";
// Custom Types
export type DBTable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export interface ProductVariant {
  label?: string;
  price: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  img: string | null;
  badge: string | null;
  category_id: number;
  sub_category_: number | null;
  is_popular: boolean | null;
  availability: boolean;
  opt_addons: number[] | null;
  req_addons: number[] | null;
  variant: ProductVariant[] | null;
}

export interface Addon {
  id: string | number;
  label: string;
  price: string | number;
}

export interface Cart {
  type: "CAFE" | "STORE",
  total_price: number,
  products: Product[]
}

export interface CartItem {
  cartItemId: string;
  cartItemPrice: number;
  id: number | string;
  name: string;
  quantity: number;
  variant?: any;
  opt_addons?: Addon[];
  req_addons?: Addon[];
}

export interface BranchSchedule {
  days: string,
  openHour: number,
  closeHour: number,
  daysOfWeek: number[],
  hoursDisplay: string
}
