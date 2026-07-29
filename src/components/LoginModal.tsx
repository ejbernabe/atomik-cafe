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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-bg-surface border border-border rounded-2xl p-6 shadow-2xl z-10 text-text-body">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-text-muted hover:text-text-heading p-1 rounded-lg transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-text-heading mb-1">Welcome back</h2>
        <p className="text-text-muted text-sm mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-body mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-bg-sunken border border-border rounded-lg px-3 py-2 text-text-heading placeholder-text-muted focus:outline-none focus:border-border-focus transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-body mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-bg-sunken border border-border rounded-lg px-3 py-2 text-text-heading placeholder-text-muted focus:outline-none focus:border-border-focus transition-colors"
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