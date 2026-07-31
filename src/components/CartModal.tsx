import React from 'react';
import { useCart } from '../lib/useCart';
import { 
  updateCartQuantity, 
  removeFromCart, 
  clearCart, 
  type CartItem 
} from '../lib/cartUtil';
import { convertPriceToString } from '../lib/utils';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  // 1. Get cart array directly from useCart()
  const cart = useCart();

  if (!isOpen) return null;

  // 2. Calculate grand total
  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.cartItemPrice || 0),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Your Cart</h2>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white rounded-full p-1 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 divide-y divide-zinc-800/50">
          {cart.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 space-y-2">
              <p className="text-base font-medium">Your cart is empty</p>
              <p className="text-xs">Add items from the menu to get started.</p>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <div key={item.cartItemId} className="pt-3 first:pt-0 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                    {item.variant?.label && (
                      <span className="text-xs text-amber-400 font-medium">
                        Variant: {item.variant.label}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-amber-400 text-sm shrink-0">
                    {convertPriceToString(item.cartItemPrice)}
                  </span>
                </div>

                {/* Addons List */}
                {((item.req_addons && item.req_addons.length > 0) ||
                  (item.opt_addons && item.opt_addons.length > 0)) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.req_addons?.map((addon, idx) => (
                      <span key={idx} className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/50">
                        + {addon.label}
                      </span>
                    ))}
                    {item.opt_addons?.map((addon, idx) => (
                      <span key={idx} className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700/50">
                        + {addon.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quantity Controls & Remove */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                      className="px-2.5 py-1 text-amber-500 hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-medium text-zinc-200">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                      className="px-2.5 py-1 text-amber-500 hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-3">
            <div className="flex justify-between items-center text-base">
              <span className="text-zinc-400 font-medium">Total:</span>
              <span className="text-xl font-bold text-amber-400">
                {convertPriceToString(totalAmount)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-3 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                onClick={() => {}}
                className="flex-1 py-2.5 rounded-lg font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all cursor-pointer text-center text-sm"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}