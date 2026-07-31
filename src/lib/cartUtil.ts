import type { CartItem } from '../types/custom';

// 1. Storage Helpers
export const getCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem('cart');
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse cart:', error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  // Dispatch custom window event to sync state across useCart hooks
  window.dispatchEvent(new Event('cart-updated'));
};

// 2. Add To Cart
export const addToCart = (newItem: CartItem) => {
  const currentCart = getCart();

  const existingIndex = currentCart.findIndex(
    (item) => item.cartItemId === newItem.cartItemId
  );

  let updatedCart: CartItem[];

  if (existingIndex !== -1) {
    updatedCart = [...currentCart];
    updatedCart[existingIndex] = newItem;
  } else {
    updatedCart = [...currentCart, newItem];
  }

  saveCart(updatedCart);
};

// 3. Update Item Quantity
export const updateCartQuantity = (cartItemId: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  const cart = getCart();
  const updatedCart = cart.map((item) => {
    if (item.cartItemId === cartItemId) {
      // Recalculate price proportionally based on current unit price
      const unitPrice = item.quantity > 0 ? item.cartItemPrice / item.quantity : 0;
      return {
        ...item,
        quantity,
        cartItemPrice: unitPrice * quantity,
      };
    }
    return item;
  });

  saveCart(updatedCart);
};

// 4. Remove Single Item
export const removeFromCart = (cartItemId: string) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
  saveCart(updatedCart);
};

// 5. Clear Entire Cart
export const clearCart = () => {
  saveCart([]);
};