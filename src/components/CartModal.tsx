import { useState, useEffect } from 'react';
import { useCart } from '../lib/useCart';
import { clearCart, updateCartQuantity, removeFromCart } from '../lib/cartUtil';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const cart = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('🛒 Current Cart Items:', cart);
    }
  }, [isOpen, cart]);

  if (!isOpen) return null;

  // Helper to get a unique key for any cart item format
  const getItemKey = (item: any): string => {
    if (item.cartItemId) return item.cartItemId;
    
    // Fallback: build composite key if cartItemId is missing
    const addonString = item.addons ? item.addons.map((a: any) => a.name || a.id).join('-') : '';
    return `${item.id}_${item.variantLabel || 'default'}_${addonString}`;
  };

  // Calculate cart total price (including add-ons if present)
  const totalPrice = (cart || []).reduce((acc: number, item: any) => {
    const basePrice = item.variantPrice ?? item.price ?? 0;
    const addonsPrice = (item.addons || []).reduce((aSum: number, addon: any) => aSum + (addon.price || 0), 0);
    return acc + (basePrice + addonsPrice) * (item.quantity || 1);
  }, 0);

  const handleConfirmClear = () => {
    clearCart();
    setShowClearConfirm(false);
    onClose();
  };

  const handleQuantityChange = (itemKey: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      removeFromCart(itemKey);
    } else {
      updateCartQuantity(itemKey, newQty);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
        <div className="fixed inset-0" onClick={onClose} />

        <div className="bg-zinc-900 border border-zinc-800 relative w-full max-w-2xl rounded-2xl shadow-2xl z-10 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Your Cart
              </h2>
              <p className="text-sm text-zinc-400">
                {cart.length === 0 ? 'Your cart is empty' : `${cart.length} item(s) selected`}
              </p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="text-zinc-400 hover:text-white rounded-full p-2 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <p className="text-lg">No items in your cart yet.</p>
              </div>
            ) : (
              cart.map((item: any) => {
                const itemKey = getItemKey(item);
                const basePrice = item.variantPrice ?? item.price ?? 0;
                const addonsPrice = (item.addons || []).reduce((sum: number, a: any) => sum + (a.price || 0), 0);
                const itemUnitPrice = basePrice + addonsPrice;
                const itemTotal = itemUnitPrice * (item.quantity || 1);

                return (
                  <div
                    key={itemKey}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80"
                  >
                    {/* Item Details & Addons */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.name}</h3>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
                        {item.variantLabel && (
                          <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded font-medium">
                            {item.variantLabel}
                          </span>
                        )}
                        <span>₱{itemUnitPrice.toFixed(2)}</span>
                      </div>

                      {/* Display Add-ons if present */}
                      {item.addons && item.addons.length > 0 && (
                        <div className="text-xs text-zinc-500 mt-1">
                          + {item.addons.map((a: any) => a.name).join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/60 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(itemKey, item.quantity || 1, -1)}
                        className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 rounded transition-colors text-sm font-bold"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(itemKey, item.quantity || 1, 1)}
                        className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 rounded transition-colors text-sm font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right min-w-70px">
                      <span className="text-sm font-bold text-amber-400">
                        ₱{itemTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Remove Item Button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(itemKey)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-zinc-800 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center w-full text-base font-bold text-white">
              <span>Total Amount:</span>
              <span className="text-lg text-amber-400">₱{totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex flex-row items-center gap-2 w-full">
              <button
                className={`btn flex-1 inline-flex items-center justify-center leading-none btn-sm md:btn-md lg:btn-lg
                  ${cart.length === 0 ? 'btn-soft btn-secondary' : 'btn-error'}
                `}
                onClick={() => setShowClearConfirm(true)}
                disabled={cart.length === 0}
              >
                Clear Cart
              </button>
              <button
                type="submit"
                className="btn btn-warning text-zinc-950 flex-1 inline-flex items-center justify-center leading-none btn-sm md:btn-md lg:btn-lg"
                disabled={cart.length === 0}
              >
                Checkout
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          role="dialog"
          tabIndex={-1}
        >
          <div className="fixed inset-0" onClick={() => setShowClearConfirm(false)} />

          <div className="relative z-10 modal-dialog w-full max-w-md p-4">
            <div className="modal-content bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl text-white">
              <div className="modal-header relative p-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="modal-title font-bold text-lg text-amber-400">
                  Clear Cart Confirmation
                </h3>
                <button
                  type="button"
                  className="text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setShowClearConfirm(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body p-4 text-zinc-300">
                Are you sure you want to clear all items from your cart? This action cannot be undone.
              </div>

              <div className="modal-footer p-4 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-soft btn-secondary"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={handleConfirmClear}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}