// lib/cartUtil.ts

export interface CartItem {
  cartItemId: string;
  id: string | number;
  name: string;
  variantPrice: number;
  quantity: number;
  variantLabel?: string;
  addons?: { id?: string | number; name: string; price: number }[];
  [key: string]: any;
}

const CART_KEY = 'shopping_cart';

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read cart from localStorage', error);
    return [];
  }
};

const saveCart = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Dispatch custom event for current tab re-rendering
  window.dispatchEvent(new Event('cartUpdated'));
};

export const generateCartItemId = (
  productId: string | number,
  variantLabel?: string,
  addons: any[] = []
): string => {
  const addonKey = addons
    .map((a) => a.id ?? a.name)
    .sort()
    .join('-');
  return `${productId}_${variantLabel || 'default'}_${addonKey}`;
};

export const addToCart = (
  newItem: Omit<CartItem, 'cartItemId'> & { cartItemId?: string }
) => {
  const cart = getCart();

  const targetCartItemId: string =
    newItem.cartItemId ||
    generateCartItemId(newItem.id, newItem.variantLabel, newItem.addons);

  const existingIndex = cart.findIndex((item) => {
    const itemKey =
      item.cartItemId ||
      generateCartItemId(item.id, item.variantLabel, item.addons);
    return itemKey === targetCartItemId;
  });

  if (existingIndex > -1) {
    cart[existingIndex].quantity += newItem.quantity || 1;
  } else {
    const itemToAdd: CartItem = {
      id: newItem.id,
      name: newItem.name,
      variantPrice: newItem.variantPrice,
      variantLabel: newItem.variantLabel,
      addons: newItem.addons || [],
      ...newItem,
      cartItemId: targetCartItemId,
      quantity: newItem.quantity || 1,
    };
    cart.push(itemToAdd);
  }

  saveCart(cart);
};

export const updateCartQuantity = (cartItemId: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  const cart = getCart();
  const updatedCart = cart.map((item) => {
    const itemKey =
      item.cartItemId ||
      generateCartItemId(item.id, item.variantLabel, item.addons);
    if (itemKey === cartItemId) {
      return { ...item, quantity };
    }
    return item;
  });

  saveCart(updatedCart);
};

export const removeFromCart = (cartItemId: string) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => {
    const itemKey =
      item.cartItemId ||
      generateCartItemId(item.id, item.variantLabel, item.addons);
    return itemKey !== cartItemId;
  });

  saveCart(updatedCart);
};

export const clearCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
};