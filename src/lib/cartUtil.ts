import type { Addon, ProductVariant } from "../data/database";

export interface CartItem {
  id: string | number;
  name: string;
  quantity: number;
  variant: ProductVariant;
  opt_addons?: Addon[];
  req_addon?: Addon | null;
}

const CART_KEY = 'atomik_cart_items';

// Get items from localStorage
export const getCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage', error);
    return [];
  }
};

/**
 * Helper to check if two cart items have identical choices:
 * - Same base item ID
 * - Same variant ID (or identical variant object)
 * - Same required addon
 * - Same optional addons (order-independent)
 */
const areItemsEqual = (item1: CartItem, item2: CartItem): boolean => {
  if (item1.id !== item2.id) return false;

  // Compare Variant (using variant id if available, otherwise stringified comparison)
  const v1 = item1.variant?.label ?? JSON.stringify(item1.variant);
  const v2 = item2.variant?.label ?? JSON.stringify(item2.variant);
  if (v1 !== v2) return false;

  // Compare Required Addon
  const req1 = item1.req_addon?.id ?? (item1.req_addon ? JSON.stringify(item1.req_addon) : null);
  const req2 = item2.req_addon?.id ?? (item2.req_addon ? JSON.stringify(item2.req_addon) : null);
  if (req1 !== req2) return false;

  // Compare Optional Addons (sort by ID/name first so selection order doesn't break equality)
  const addons1 = (item1.opt_addons || [])
    .map((a) => a.id ?? JSON.stringify(a))
    .sort();
  const addons2 = (item2.opt_addons || [])
    .map((a) => a.id ?? JSON.stringify(a))
    .sort();

  if (addons1.length !== addons2.length) return false;

  return addons1.every((id, index) => id === addons2[index]);
};

// Add item and notify subscribers
export const addToCart = (newItem: CartItem) => {
  const currentCart = getCart();

  // Find index of an existing item with the EXACT same configuration
  const existingIndex = currentCart.findIndex((item) =>
    areItemsEqual(item, newItem)
  );

  if (existingIndex > -1) {
    currentCart[existingIndex].quantity += newItem.quantity || 1;
  } else {
    currentCart.push({ ...newItem, quantity: newItem.quantity || 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(currentCart));

  // Trigger custom event so other components know localStorage updated
  window.dispatchEvent(new Event('cartUpdated'));
};

// Clear cart helper
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
};