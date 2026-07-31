// lib/useCart.ts
import { useState, useEffect } from 'react';
import { getCart, type CartItem } from './cartUtil';

export function useCart(): CartItem[] {
  const [cart, setCart] = useState<CartItem[]>(() => getCart());

  useEffect(() => {
    // Initial sync
    setCart(getCart());

    const handleCartChange = () => {
      setCart(getCart());
    };

    // Listen to custom event for same-tab updates
    window.addEventListener('cartUpdated', handleCartChange);
    // Listen to native event for cross-tab updates
    window.addEventListener('storage', handleCartChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartChange);
      window.removeEventListener('storage', handleCartChange);
    };
  }, []);

  return cart;
}