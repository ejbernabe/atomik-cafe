import { useState } from "react";
import { type DBTable } from "../types/custom";

interface PromoModalProps {
  item: DBTable<'promos'>;
  onClose: () => void;
}

export default function PromoModal({ item, onClose }: PromoModalProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop Click to Close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Side: Image / Placeholder */}
        <div className="relative bg-zinc-800/50 flex items-center justify-center min-h-50 md:min-h-80 overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800">
          {item.img ? (
            <>
              {/* Skeleton Placeholder shown while image is loading */}
              {isImageLoading && (
                <div className="absolute inset-0 bg-zinc-800 animate-pulse flex items-center justify-center">
                  <span className="loading loading-bars loading-xl text-white"></span>
                </div>
              )}

              <img
                src={item.img}
                alt={item.label}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
              />
            </>
          ) : (
            <div className="text-4xl text-zinc-600 opacity-40">☕</div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
                {item.day}
              </h2>
              <span className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-1 rounded-full font-mono font-bold">
                ⏰ {item.time}
              </span>
            </div>

            <h2 className="text-2xl text-white font-bold mt-2">
              {item.label}
            </h2>

            <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-zinc-800 flex gap-3">
            <button
              onClick={onClose}
              className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}