// Define TS interface if using TypeScript
export interface PromoItem {
  id: string;
  day: string;
  promo: string;
  deal: string;
  time: string;
  img?: string;
}

interface PromoModalProps {
  item: PromoItem | null;
  onClose: () => void;
}

export default function PromoModal({ item, onClose }: PromoModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Side: Image */}
        <div className="bg-bg-sunken flex items-center justify-center min-h-50 md:min-h-80 overflow-hidden border-b md:border-b-0 md:border-r border-border">
          {item.img ? (
            <img
              src={item.img}
              alt={item.promo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl text-text-muted opacity-40">☕</div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black text-text-muted uppercase tracking-widest">
                {item.day}
              </span>
              <span className="bg-bg-sunken border border-border text-text-heading text-xs px-3 py-1 rounded-full font-mono font-bold">
                ⏰ {item.time}
              </span>
            </div>

            <h2 className="text-2xl font-black text-text-heading mt-2">
              {item.promo}
            </h2>

            <p className="text-text-muted text-sm mt-3 leading-relaxed">
              {item.deal}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-border flex gap-3">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-badge text-badge-text hover:opacity-90 transition-opacity cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}