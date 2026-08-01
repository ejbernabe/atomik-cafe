import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import CartModal from './CartModal';

import { useCart } from '../lib/useCart';

type Mode = 'cafe' | 'store';

const NAV_LINKS = {
  cafe: [
    { label: 'Home', to: '/' },
    { label: 'Menu', to: '/menu' },
    { label: 'Promos', to: '/promos' },
    { label: 'About', to: '/about' },
  ],
  store: [
    { label: 'Home', to: '/homeStore' },
    { label: 'Products', to: '/products' },
    { label: 'Paiwan', to: '/paiwan' },
    { label: 'Events', to: '/events' },
    { label: 'About', to: '/about' },
  ]
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [brand, setBrand] = useState<Mode>('cafe');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();
  
  const cart = useCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  // const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.title = brand === 'cafe' ? 'Atomik | Cafe' : 'Atomik | Store';
  }, [brand]); 

  const handleBrandToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      const nextBrand = brand === 'cafe' ? 'store' : 'cafe';
      setBrand(nextBrand);
      setIsTransitioning(false);

      navigate(nextBrand === 'cafe' ? '/' : '/homeStore');
    }, 150); 
  };

  const currentLinks = NAV_LINKS[brand];

  return (
    <>
      <nav className="bg-bg-surface text-text-body border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Switcher */}
            <div className="shrink-0 flex items-center space-x-2">
              <Link to={brand === 'cafe' ? '/' : '/homeStore'} className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center font-bold text-lg text-brand-foreground shadow-sm">
                  A
                </div>
              </Link>
              
              <div className="flex items-center space-x-1 font-bold text-xl tracking-tight select-none text-text-heading">
                <Link to={brand === 'cafe' ? '/' : '/homeStore'} className="hover:opacity-90 transition-opacity">
                  <span>Atomik</span>
                </Link>

                {/* Switchable Brand Segment */}
                <button
                  type="button"
                  onClick={handleBrandToggle}
                  id="switchBrand"
                  className="group relative cursor-pointer px-2 py-0.5 rounded-md hover:bg-bg-sunken border border-transparent hover:border-border-subtle transition-all duration-200 outline-none focus:ring-1 focus:ring-border-focus"
                  title="Click to switch brand mode"
                >
                  <span
                    className={`inline-block transition-all duration-200 ease-out transform ${
                      isTransitioning
                        ? 'opacity-0 -translate-y-1 scale-95 blur-xs'
                        : 'opacity-100 translate-y-0 scale-100 blur-none'
                    } text-text-muted group-hover:text-text-heading font-semibold`}
                  >
                    {brand === 'cafe' ? 'Cafe' : 'Store'}
                  </span>

                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider text-text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-normal">
                    Switch to {brand === 'cafe' ? 'Store' : 'Cafe'}
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <div
                className={`flex items-center space-x-8 transition-all duration-200 ${
                  isTransitioning ? 'opacity-0 translate-y-0.5' : 'opacity-100 translate-y-0'
                }`}
              >
                {currentLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className={({ isActive }) =>
                      `transition-colors ${
                        isActive
                          ? 'text-text-heading font-semibold underline underline-offset-4 decoration-brand'
                          : 'text-text-muted hover:text-text-heading'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-text-muted hover:text-text-heading hover:bg-bg-sunken rounded-lg cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>Cart ({totalItems})</span>
              </button>

              {/* Login Button */}
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="text-sm font-semibold text-button-primary-text bg-button-primary hover:bg-button-primary-hover transition-colors px-4 py-2 rounded-lg cursor-pointer shadow-sm"
              >
                Log in
              </button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-text-muted hover:text-text-heading focus:outline-none focus:ring-2 focus:ring-border-focus rounded-md p-1"
                aria-label="Toggle Menu"
              >
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-bg-surface px-4 pt-2 pb-6 space-y-3">
            <div
              className={`space-y-1 transition-opacity duration-200 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {currentLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-bg-sunken text-text-heading font-semibold'
                        : 'text-text-muted hover:bg-bg-sunken hover:text-text-heading'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-4 border-t border-border flex flex-col space-y-2">
              {/* Mobile Cart Button (Store Mode Only) */}
              {brand === 'store' && (
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 text-center text-sm font-semibold text-text-heading bg-bg-sunken hover:bg-border-subtle transition-colors px-4 py-2 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>Cart</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm font-semibold text-button-primary-text bg-button-primary hover:bg-button-primary-hover transition-colors px-4 py-2 rounded-lg cursor-pointer"
              >
                Log in
              </button>
            </div>
          </div>
        )}
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}