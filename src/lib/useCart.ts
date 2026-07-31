import { useState, useEffect } from 'react';
import { getCart, type CartItem } from './cartUtil';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(getCart());

  useEffect(() => {
    const handleCartChange = () => {
      setCart(getCart());
    };

    // Listen to custom window event
    window.addEventListener('cartUpdated', handleCartChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartChange);
    };
  }, []);

  return cart;
};