interface ProductModalProps {
  onClose: () => void;
}

export default function ProductModal({ onClose }: ProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

      </div>
    </div>
  );
}