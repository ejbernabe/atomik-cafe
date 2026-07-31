// lib/useCart.ts
import { useState, useEffect } from 'react';
import { getCart, type CartItem } from './cartUtil';

export function useCart(): CartItem[] {
  const [cart, setCart] = useState<CartItem[]>(() => getCart());

  useEffect(() => {
    const syncCart = () => {
      setCart(getCart());
    };

    window.addEventListener('cart-updated', syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('cart-updated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  return cart;
}