import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null; // Don't render anything when closed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here...
    console.log('Logging in:', { email, password });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="bg-zinc-900 border border-zinc-800 relative w-full max-w-md rounded-2xl p-6 shadow-2xl z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white rounded-full p-2 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-amber-400 text-2xl font-bold mb-1">Welcome back</h2>
        <p className="text-white text-sm mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white block text-xs font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              className="w-full bg-bg-sunken border-2 border-border rounded-lg px-3 py-2 text-text-heading placeholder-text-muted focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div>
            <label className="text-white block text-xs font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-bg-sunken border-2 border-border rounded-lg px-3 py-2 text-text-heading placeholder-text-muted focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-button-primary hover:bg-button-primary-hover text-button-primary-text font-semibold py-2 rounded-lg transition-colors shadow-sm mt-2 cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}