import { useState, useEffect } from 'react';
import { useCart } from '../lib/useCart';
import { clearCart } from '../lib/cartUtil';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const cart = useCart();

  // Console log every time the modal opens or the cart contents change
  useEffect(() => {
    if (isOpen) {
      console.log('🛒 Current Cart Items:', cart);
    }
  }, [isOpen, cart]);

  if(!isOpen) return null;

  const handleClearCart = () => {
    // Optional: Ask for confirmation before clearing
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="bg-zinc-900 border border-zinc-800 relative w-full max-w-md rounded-2xl p-6 shadow-2xl z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white rounded-full p-2 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="cart-modal-header">
          <h2>Your Cart</h2>
          {cart.length > 0 && (
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}