import { useState, useEffect } from 'react';
import type { Product, Addon } from '../data/database';
import { getOptionalAddons, getRequiredAddons } from '../services/products';
import { convertPriceToString, } from '../lib/utils';
import { addToCart } from '../lib/cartUtil';

interface ProductModalProps {
  product: Product | null;
  categoryName: string;
  onClose: () => void;
}

export default function ProductModal({ product, categoryName, onClose }: ProductModalProps) {
  // 1. Keep the initial state simple
  const [optionalAddons, setOptionalAddons] = useState<Addon[]>([]);
  const [requiredAddons, setRequiredAddons] = useState<Addon[]>([]);

  // Type this as a single Addon or null
  const [selectedRequiredAddon, setSelectedRequiredAddon] = useState<Addon | null>(null);

  // Your existing typed state
  const [selectedOptionalAddons, setSelectedOptionalAddons] = useState<Addon[]>([]);

  // Type this based on your variant structure
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product?.variant?.[0] || null
  );

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchAddons() {
      if (!product) {
        setOptionalAddons([]);
        setRequiredAddons([]);
        setSelectedRequiredAddon(null); 
        setSelectedVariant(null);
        return;
      }

      if (product.variant?.[0]) {
        setSelectedVariant(product.variant[0]);
      }

      try {
        // 3. Cast the API responses to your Addon[] type
        const [optional, required] = await Promise.all([
          getOptionalAddons(product.id) as Promise<Addon[]>,
          getRequiredAddons(product.id) as Promise<Addon[]>,
        ]);

        const validOptional = Array.isArray(optional) ? optional : [];
        const validRequired = Array.isArray(required) ? required : [];

        // ✅ TypeScript now accepts these because the state types and data types match perfectly
        setOptionalAddons(validOptional);
        setRequiredAddons(validRequired);

        if (validRequired.length > 0) {
          setSelectedRequiredAddon(validRequired[0]);
        } else {
          setSelectedRequiredAddon(null);
        }
      } catch (error) {
        console.error('Failed to fetch addons:', error);
        setOptionalAddons([]);
        setRequiredAddons([]);
        setSelectedRequiredAddon(null);
      }
    }

    fetchAddons();
  }, [product?.id]); 

  if (!product || product.id === undefined) return;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      quantity: quantity,
      variant: selectedVariant,
      opt_addons: selectedOptionalAddons,
      req_addon: selectedRequiredAddon
    });

    if (onClose) onClose();
  };

  // 🛑 MOVE THIS BELOW ALL HOOKS
  // React requires all hooks (useState, useEffect) to run in the exact same order every render.
  if (!product) return null;

  // Selection
  
  const toggleOptionalAddon = (addon: Addon) => {
    setSelectedOptionalAddons((prev) =>
      prev.some((item) => (item.id ?? item.label) === (addon.id ?? addon.label))
        ? prev.filter((item) => (item.id ?? item.label) !== (addon.id ?? addon.label))
        : [...prev, addon]
    );
  };

  const isSubmitDisabled = requiredAddons.length > 0 && !selectedRequiredAddon;

  // --- PRICE CALCULATION LOGIC ---
  // Helper to parse strings like "$12.50" or "12.50" into a clean float number
  const parsePrice = (priceVal: any): number => {
    if (typeof priceVal === 'number') return priceVal;
    if (typeof priceVal === 'string') {
      const parsed = parseFloat(priceVal.replace(/[^0-9.-]+/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const variantPrice = parsePrice(selectedVariant?.price);
  const requiredAddonPrice = parsePrice(selectedRequiredAddon?.price);
  const optionalAddonsPrice = selectedOptionalAddons.reduce(
    (sum, addon) => sum + parsePrice(addon.price),
    0
  );

  const unitPrice = variantPrice + requiredAddonPrice + optionalAddonsPrice;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  return (
    <div className="cursor-default fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
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

        {/* Variants / Prices in Modal */}
        {/* <div className="border-t border-zinc-800  pt-4 space-y-2">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase">Variants & Pricing</h4>
          <div className="space-y-1.5">
            {Array.isArray(product.variant) &&
              product.variant.map((v, idx) => (
                <div key={idx} className="cursor-pointer flex justify-between items-center bg-zinc-950 hover:bg-zinc-800/50 px-3 py-2 rounded-lg border border-zinc-800/50 text-sm">
                  <span className="text-zinc-300">{v.label || 'Standard'}</span>
                  <span className="font-bold text-amber-400">{v.price}</span>
                </div>
              ))}
          </div>
        </div> */}

        {/* Required Addons */}
        {/* {requiredAddons.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            <h4 className="text-xs font-semibold text-amber-400 uppercase">Required Addons</h4>
            <div className="space-y-1.5">
              {requiredAddons.map((addon, idx) => (
                <div key={idx} className="cursor-pointer flex justify-between items-center bg-zinc-950 hover:bg-zinc-800/50 px-3 py-2 rounded-lg border border-zinc-800/50 text-sm">
                  <span className="text-zinc-300">{addon.label}</span>
                  <span className="font-bold text-amber-400">{addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Optional Addons */}
        {/* {optionalAddons.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase">Optional Addons</h4>
            <div className="space-y-1.5">
              {optionalAddons.map((addon, idx) => (
                <div key={idx} className="cursor-pointer flex justify-between items-center bg-zinc-950 hover:bg-zinc-800/50 px-3 py-2 rounded-lg border border-zinc-800/50 text-sm">
                  <span className="text-zinc-300">{addon.label}</span>
                  <span className="font-bold text-amber-400">{addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {Array.isArray(product.variant) &&
          product.variant.map((v, idx) => {
            // Check selection state (comparing index or unique identifier)
            const isSelected = selectedVariant === v || (selectedVariant === null && idx === 0);

            return (
              <div
                key={idx}
                onClick={() => setSelectedVariant(v)}
                className={`flex justify-between items-center px-3 py-2 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500/50 cursor-default'
                    : 'bg-zinc-950 hover:bg-zinc-800/50 border-zinc-800/50 cursor-pointer1'
                }`}
              >
                <span className={isSelected ? 'text-white font-medium' : 'text-zinc-300'}>
                  {v.label || 'Standard'}
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">{convertPriceToString(v.price)}</span>
                  
                  {/* Green Checkmark Icon */}
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
              <span className="text-[10px] text-zinc-400">Select at least 1</span>
            </div>

            <div className="space-y-1.5">
              {requiredAddons.map((addon, idx) => {
                const isSelected =
                  selectedRequiredAddon === addon ||
                  selectedRequiredAddon?.label === addon.label ||
                  (selectedRequiredAddon === null && idx === 0);

                return (
                  <div
                    key={addon.id || idx}
                    onClick={() => setSelectedRequiredAddon(addon)}
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

        <div className="flex items-center gap-3 pt-2">
          {/* <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button> */}

          {/* Quantity Selector */}
          <div className="flex items-center border border-zinc-700 rounded-lg bg-zinc-900 overflow-hidden">
            {/* Decrease Button */}
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1 || isSubmitDisabled}
              className={`px-3 py-3 text-amber-500 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default transition-colors flex items-center justify-center"
                ${ isSubmitDisabled ? 'cursor-default' : 'cursor-pointer' }`}
              aria-label="Decrease quantity"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <polygon points="15,4 7,12 15,20" />
              </svg>
            </button>

            {/* Disabled Quantity Input */}
            <input
              type="text"
              disabled
              value={quantity}
              className="w-10 text-center bg-transparent text-zinc-100 font-medium text-sm focus:outline-none cursor-default"
            />

            {/* Increase Button */}
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              disabled={isSubmitDisabled}
              className={`px-3 py-3 text-amber-500 hover:bg-zinc-800 disabled:opacity-30 transition-colors flex items-center justify-center 
                ${ isSubmitDisabled ? 'cursor-default' : 'cursor-pointer' }`}
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