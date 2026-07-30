import { useState, useEffect } from 'react';
import type { Product } from '../data/database';
import { getOptionalAddons, getRequiredAddons } from '../services/products';

interface ProductModalProps {
  product: Product | null;
  categoryName: string;
  onClose: () => void;
}

export default function ProductModal({ product, categoryName, onClose }: ProductModalProps) {
  const [optionalAddons, setOptionalAddons] = useState<any[]>([]);
  const [requiredAddons, setRequiredAddons] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAddons() {
      if (!product) {
        setOptionalAddons([]);
        setRequiredAddons([]);
        return;
      }

      try {
        const [optional, required] = await Promise.all([
          getOptionalAddons(product.id),
          getRequiredAddons(product.id),
        ]);

        setOptionalAddons(Array.isArray(optional) ? optional : []);
        setRequiredAddons(Array.isArray(required) ? required : []);
      } catch (error) {
        console.error('Failed to fetch addons:', error);
        setOptionalAddons([]);
        setRequiredAddons([]);
      }
    }

    fetchAddons();
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-full p-2 transition-colors cursor-pointer"
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
          <span className="text-xs font-medium text-amber-500 uppercase tracking-wider">
            {categoryName}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{product.description}</p>
          )}
        </div>

        {/* Variants / Prices in Modal */}
        <div className="border-t border-zinc-800 pt-4 space-y-2">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase">Variants & Pricing</h4>
          <div className="space-y-1.5">
            {Array.isArray(product.variant) &&
              product.variant.map((v, idx) => (
                <div key={idx} className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800/50 text-sm">
                  <span className="text-zinc-300">{v.label || 'Standard'}</span>
                  <span className="font-bold text-amber-400">{v.price}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Required Addons */}
        {requiredAddons.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            <h4 className="text-xs font-semibold text-amber-400 uppercase">Required Addons</h4>
            <div className="space-y-1.5">
              {requiredAddons.map((addon, idx) => (
                <div key={idx} className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800/50 text-sm">
                  <span className="text-zinc-300">{addon.label}</span>
                  <span className="font-bold text-amber-400">{addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Addons */}
        {optionalAddons.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 space-y-2">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase">Optional Addons</h4>
            <div className="space-y-1.5">
              {optionalAddons.map((addon, idx) => (
                <div key={idx} className="flex justify-between items-center bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800/50 text-sm">
                  <span className="text-zinc-300">{addon.label}</span>
                  <span className="font-bold text-amber-400">{addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}