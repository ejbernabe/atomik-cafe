import { useState, useEffect } from 'react';
import type { Product, Addon } from '../data/database';
import { getOptionalAddons, getRequiredAddons } from '../services/products';
import { convertPriceToString, convertStringToPrice } from '../lib/utils';
import { addToCart, getCart, type CartItem } from '../lib/cartUtil';
import { useCart } from '../lib/useCart';

interface ProductModalProps {
  product: Product | null;
  categoryName: string;
  onClose: () => void;
}

export default function ProductModal({ product, categoryName, onClose }: ProductModalProps) {
  // 1. Keep the initial state simple
  const [optionalAddons, setOptionalAddons] = useState<Addon[]>([]);
  const [requiredAddons, setRequiredAddons] = useState<Addon[]>([]);

  // Array state for selected required addons (max 1 selected at a time)
  const [selectedRequiredAddons, setSelectedRequiredAddons] = useState<Addon[]>([]);

  // Array state for selected optional addons (multiple allowed)
  const [selectedOptionalAddons, setSelectedOptionalAddons] = useState<Addon[]>([]);

  // Variant selection state
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product?.variant?.[0] || null
  );

  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cart = useCart();

  useEffect(() => {
    async function fetchAddons() {
      // Always reset selected addons whenever product changes
      setSelectedOptionalAddons([]);
      setSelectedRequiredAddons([]);

      if (!product) {
        setOptionalAddons([]);
        setRequiredAddons([]);
        setSelectedVariant(null);
        return;
      }

      if (product.variant?.[0]) {
        setSelectedVariant(product.variant[0]);
      }

      try {
        const [optional, required] = await Promise.all([
          getOptionalAddons(product.id) as Promise<Addon[]>,
          getRequiredAddons(product.id) as Promise<Addon[]>,
        ]);

        const validOptional = Array.isArray(optional) ? optional : [];
        const validRequired = Array.isArray(required) ? required : [];

        setOptionalAddons(validOptional);
        setRequiredAddons(validRequired);
      } catch (error) {
        console.error('Failed to fetch addons:', error);
        setOptionalAddons([]);
        setRequiredAddons([]);
      }
    }

    fetchAddons();
  }, [product?.id]);

  if (!product || product.id === undefined) return null;

  // Toggle optional addons (multi-select)
  const toggleOptionalAddon = (addon: Addon) => {
    setSelectedOptionalAddons((prev) =>
      prev.some((item) => (item.id ?? item.label) === (addon.id ?? addon.label))
        ? prev.filter((item) => (item.id ?? item.label) !== (addon.id ?? addon.label))
        : [...prev, addon]
    );
  };

  // Toggle required addons (single-select behavior in an array)
  const toggleRequiredAddon = (addon: Addon) => {
    setSelectedRequiredAddons((prev) => {
      const isAlreadySelected = prev.some(
        (item) => (item.id ?? item.label) === (addon.id ?? addon.label)
      );
      return isAlreadySelected ? [] : [addon];
    });
  };

  // Check if required addons exist but none are selected
  const isSubmitDisabled = requiredAddons.length > 0 && selectedRequiredAddons.length === 0;

  // --- PRICE CALCULATION LOGIC ---
  const parsePrice = (priceVal: any): number => {
    if (typeof priceVal === 'number') return priceVal;
    if (typeof priceVal === 'string') {
      const parsed = parseFloat(priceVal.replace(/[^0-9.-]+/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const variantPrice = parsePrice(selectedVariant?.price);
  const requiredAddonPrice = selectedRequiredAddons.reduce(
    (sum, addon) => sum + parsePrice(addon.price),
    0
  );
  const optionalAddonsPrice = selectedOptionalAddons.reduce(
    (sum, addon) => sum + parsePrice(addon.price),
    0
  );

  const unitPrice = variantPrice + requiredAddonPrice + optionalAddonsPrice;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleAddToCart = () => {
    const getAddonKeys = (addons: Addon[]) =>
      addons.map((a) => String(a.id ?? a.label)).sort();

    const currentOptKeys = getAddonKeys(selectedOptionalAddons);
    const currentReqKeys = getAddonKeys(selectedRequiredAddons);

    // Read current cart directly from storage/state to check for duplicates
    const currentCart = getCart();

    const existingItem = currentCart.find((item) => {
      if (item.id !== product.id) return false;

      const itemVariantLabel = item.variant?.label ?? null;
      const selectedVariantLabel = selectedVariant?.label ?? null;
      if (itemVariantLabel !== selectedVariantLabel) return false;

      const itemOptKeys = getAddonKeys(item.opt_addons || []);
      if (
        itemOptKeys.length !== currentOptKeys.length ||
        !itemOptKeys.every((key, idx) => key === currentOptKeys[idx])
      ) {
        return false;
      }

      const itemReqKeys = getAddonKeys(item.req_addons || []);
      if (
        itemReqKeys.length !== currentReqKeys.length ||
        !itemReqKeys.every((key, idx) => key === currentReqKeys[idx])
      ) {
        return false;
      }

      return true;
    });

    const isExisting = Boolean(existingItem);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const newTotalPrice = parsePrice(unitPrice * newQuantity);

      const updatedItem: CartItem = {
        ...existingItem,
        quantity: newQuantity,
        cartItemPrice: newTotalPrice,
      };

      addToCart(updatedItem);
    } else {
      const cartItem: CartItem = {
        cartItemId: String(Date.now()),
        cartItemPrice: parsePrice(totalPrice),
        id: product.id,
        name: product.name,
        quantity: quantity,
        variant: selectedVariant,
        opt_addons: selectedOptionalAddons ?? [],
        req_addons: selectedRequiredAddons ?? [],
      };

      addToCart(cartItem);
    }

    // Fetch the latest cart state after adding/updating
    const updatedCart = getCart();

    // Log requested outputs
    console.log('Is existing item:', isExisting);
    console.log('Cart after update:', updatedCart);

    setToastMessage(`${quantity}x ${product.name} is successfully added to cart`);

    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  return (
    <div
      className="cursor-default fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg border border-emerald-500/30 animate-bounce">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white rounded-full p-2 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {product.img && (
          <div className="w-full flex items-center justify-center overflow-hidden rounded-xl p-2">
            <img
              src={product.img}
              alt={product.name}
              className="w-auto h-auto max-h-[50vh] max-w-full object-contain rounded-lg"
            />
          </div>
        )}

        <div>
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
            {categoryName}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{product.description}</p>
          )}
        </div>

        {/* Product Variants */}
        {Array.isArray(product.variant) &&
          product.variant.map((v, idx) => {
            const isSelected = selectedVariant === v || (selectedVariant === null && idx === 0);

            return (
              <div
                key={idx}
                onClick={() => setSelectedVariant(v)}
                className={`flex justify-between items-center px-3 py-2 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500/50 cursor-default'
                    : 'bg-zinc-950 hover:bg-zinc-800/50 border-zinc-800/50 cursor-pointer'
                }`}
              >
                <span className={isSelected ? 'text-white font-medium' : 'text-zinc-300'}>
                  {v.label || 'Standard'}
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">{convertPriceToString(v.price)}</span>
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-emerald-500 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}

        {/* Required Addons */}
        {requiredAddons.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold text-amber-400 uppercase">
                Required Addons <span className="text-red-400">*</span>
              </h4>
              <span className="text-[10px] text-zinc-400">Select 1</span>
            </div>

            <div className="space-y-1.5">
              {requiredAddons.map((addon, idx) => {
                const isSelected = selectedRequiredAddons.some(
                  (item) => item && addon && (item.id ?? item.label) === (addon.id ?? addon.label)
                );
                return (
                  <div
                    key={addon.id || idx}
                    onClick={() => toggleRequiredAddon(addon)}
                    className={`cursor-pointer flex justify-between items-center px-3 py-2 rounded-lg border text-sm transition-colors ${
                      isSelected
                        ? 'bg-zinc-900 border-amber-500/50'
                        : 'bg-zinc-950 hover:bg-zinc-800/50 border-zinc-800/50'
                    }`}
                  >
                    <span className={isSelected ? 'text-white font-medium' : 'text-zinc-300'}>
                      {addon.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400">{convertPriceToString(addon.price)}</span>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-emerald-500 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Addons */}
        {optionalAddons.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            <h4 className="text-xs font-semibold text-amber-400 uppercase">Optional Addons</h4>
            <div className="space-y-1.5">
              {optionalAddons.map((addon, idx) => {
                const isSelected = selectedOptionalAddons.some(
                  (item) => item && addon && (item.id ?? item.label) === (addon.id ?? addon.label)
                );

                return (
                  <div
                    key={addon.id || idx}
                    onClick={() => toggleOptionalAddon(addon)}
                    className={`cursor-pointer flex justify-between items-center px-3 py-2 rounded-lg border text-sm transition-colors ${
                      isSelected
                        ? 'bg-zinc-900 border-amber-500/50'
                        : 'bg-zinc-950 hover:bg-zinc-800/50 border-zinc-800/50'
                    }`}
                  >
                    <span className={isSelected ? 'text-white font-medium' : 'text-zinc-300'}>
                      {addon.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400">{convertPriceToString(addon.price)}</span>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-emerald-500 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-3 pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1 || isSubmitDisabled}
              className={`px-3 py-3 text-amber-500 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default transition-colors flex items-center justify-center ${
                isSubmitDisabled ? 'cursor-default' : 'cursor-pointer'
              }`}
              aria-label="Decrease quantity"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <polygon points="15,4 7,12 15,20" />
              </svg>
            </button>

            <input
              type="text"
              disabled
              value={quantity}
              className="w-10 text-center bg-transparent text-zinc-100 font-medium text-sm focus:outline-none cursor-default"
            />

            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              disabled={isSubmitDisabled}
              className={`px-3 py-3 text-amber-500 hover:bg-zinc-800 disabled:opacity-30 transition-colors flex items-center justify-center ${
                isSubmitDisabled ? 'cursor-default' : 'cursor-pointer'
              }`}
              aria-label="Increase quantity"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <polygon points="9,4 17,12 9,20" />
              </svg>
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isSubmitDisabled}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
              isSubmitDisabled
                ? 'bg-zinc-800 text-zinc-500 cursor-default opacity-50'
                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer'
            }`}
          >
            Add to Cart &bull; {convertPriceToString(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}