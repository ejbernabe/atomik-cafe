import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../lib/useCart';
import { 
  updateCartQuantity, 
  removeFromCart, 
  clearCart, 
  type CartItem, 
  getCart
} from '../lib/cartUtil';
import { convertPriceToString } from '../lib/utils';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const cart = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Track modal step: 'cart' | 'checkout'
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  // Track state for encoded QR text
  const [qrData, setQrData] = useState<string>('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.cartItemPrice || 0),
    0
  );

  // Helper to handle closing and resetting state back to 'cart'
  const handleCloseAll = () => {
    setStep('cart');
    onClose();
  };

  const doneQR = () => {
    onClose();
    clearCart();
  }

  const handleConfirmClear = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const handleCheckout = () => {
    const currentCart = getCart();
    // console.log('Proceeding to checkout with cart items:', currentCart);

    const textArr: string[] = [];
    textArr.push("--- ORDER SUMMARY ---");
    textArr.push("Amount to Collect: " + convertPriceToString(totalAmount));

    for (let i = 0; i < currentCart.length; i++) {
      const item = currentCart[i];

      const allAddons = [
        ...(item.req_addons || []),
        ...(item.opt_addons || []),
      ];

      const addonsText = allAddons.length > 0
        ? allAddons
            .map((addon) => {
              const priceStr = addon.price ? ` (${convertPriceToString(addon.price)})` : '';
              return `${addon.label}${priceStr}`;
            })
            .join(', ')
        : 'No addons';

      const text = `${item.quantity}x ${item.name} -- ${addonsText} -- ${convertPriceToString(item.cartItemPrice)}`;
      textArr.push(text);
    }

    // Convert array to a single multiline string for the QR Code
    setQrData(textArr.join('\n'));
    setStep('checkout');
  };

  return (
    <>
      {/* 1. Main Cart View */}
      {step === 'cart' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleCloseAll}
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
                onClick={handleCloseAll}
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
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="px-3 py-2.5 rounded-lg border btn btn-error text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="flex-1 py-2.5 rounded-lg font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all cursor-pointer text-center text-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Checkout / QR View */}
      {step === 'checkout' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleCloseAll}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <h2 className="text-lg font-bold text-white">Order Summary QR</h2>
              </div>
              <button
                onClick={handleCloseAll}
                className="text-zinc-400 hover:text-white rounded-full p-1 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* QR Code Section */}
            <div className="py-4 flex flex-col items-center justify-center space-y-3 shrink-0">
              <div className="p-3 bg-white rounded-xl shadow-lg border border-zinc-200 flex items-center justify-center">
                <QRCodeSVG
                  value={qrData}
                  size={180}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              
              <div className="text-center space-y-0.5">
                <p className="text-xs text-zinc-400">Show this code at the counter to place order</p>
                <p className="text-sm font-bold text-amber-400">
                  Total: {convertPriceToString(totalAmount)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-800 pt-3 shrink-0">
              <button
                type="button"
                onClick={doneQR}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-colors cursor-pointer text-center block"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div
          id="slide-up-animated-modal"
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 transition-all"
          role="dialog"
          tabIndex={-1}
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="overlay-animation-target modal-dialog mt-4 transition-all ease-out max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl relative">
              <div className="modal-header flex justify-between items-center pb-3">
                <h3 className="modal-title text-lg font-bold text-white">Clear Cart Confirmation</h3>
                <button
                  type="button"
                  className="btn btn-text btn-circle btn-sm text-zinc-400 hover:text-white"
                  aria-label="Close"
                  onClick={() => setShowClearConfirm(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body py-4 text-zinc-300 text-sm">
                Are you sure you want to clear all items from your cart? This action cannot be undone.
              </div>
              <div className="modal-footer flex justify-end gap-2 pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  className="btn btn-soft btn-secondary px-4 py-2 rounded-lg text-sm"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-error px-4 py-2 rounded-lg text-sm font-semibold"
                  onClick={handleConfirmClear}
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}