import { useMemo } from 'react';
import { FULL_MENU } from '../data/MenuData'; // Adjust path if needed

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  productId,
}: ProductModalProps) {
  // Look up the selected product from your data
  const product = useMemo(() => {
    if (!productId) return null;
    return FULL_MENU.find((item) => item.id === productId) || null;
  }, [productId]);

  // Don't render anything if modal is closed or product is missing
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop / Overlay (Click outside to close) */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          {/* Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-text-muted hover:text-text-heading p-1 rounded-lg transition-colors cursor-pointer"
          >
            ✕
          </button>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              {product.category}
            </span>
            <h3 className="text-xl text-text-heading font-bold mt-1">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {product.description && (
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Pricing & Variants Section */}
          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              Pricing & Sizes
            </h4>
            <div className="space-y-1.5">
              {product.variant && product.variant.length > 0 ? (
                product.variant.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-zinc-300 font-medium">
                      {v.label || 'Standard'}
                    </span>
                    <span className="text-amber-500 font-bold">{v.price}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-300">Price</span>
                  <span className="text-amber-500 font-bold">
                    {/* Fallback if variant isn't an array */}
                    {(product.variant as any)?.price || 'N/A'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="p-5 border-t border-zinc-800/80 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-800 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-900/20"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}