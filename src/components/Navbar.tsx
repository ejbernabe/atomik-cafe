import { useState, useEffect } from 'react';
import LoginModal from './LoginModal'; // Import the separated modal

  type Mode = 'cafe' | 'store';
  const NAV_LINKS = {
    cafe: [
      { label: 'Home', href: '#homeCafe' },
      { label: 'Menu', href: '#menu' },
      { label: 'Promos', href: '#promos' },
    ],
    store: [
      { label: 'Home', href: '#homeStore' },
      { label: 'Products', href: '#products' },
      { label: 'Paiwan', href: '#paiwan' },
      { label: 'Cart', href: '#cart' },
    ]
  }

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [brand, setBrand] = useState<Mode>('cafe');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    document.title = brand === 'cafe' ? 'Atomik | Cafe' : 'Atomik | Store';
  }, [brand]); 

  const handleBrandToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setBrand((prev) => (prev === 'cafe' ? 'store' : 'cafe'));
      setIsTransitioning(false);
    }, 150); 
  };

  const currentLinks = NAV_LINKS[brand];

  return (
    <>
      <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Switcher */}
            <div className="flex-shrink-0 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center font-bold text-lg text-black shadow-sm">
                A
              </div>
              
              <div className="flex items-center space-x-1 font-bold text-xl tracking-tight select-none">
                <span>Atomik</span>
                {/* <span className="text-slate-600">|</span> */}

                {/* Clickable Switchable Brand Segment */}
                <button
                  type="button"
                  onClick={handleBrandToggle}
                  id="switchBrand"
                  className="group relative cursor-pointer px-2 py-0.5 rounded-md hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all duration-200 outline-none focus:ring-1 focus:ring-indigo-500"
                  title="Click to switch brand mode"
                >
                  <span
                    className={`inline-block transition-all duration-200 ease-out transform ${
                      isTransitioning
                        ? 'opacity-0 -translate-y-1 scale-95 blur-xs'
                        : 'opacity-100 translate-y-0 scale-100 blur-none'
                    } ${
                      brand === 'cafe'
                        ? 'text-amber-400 font-semibold'
                        : 'text-indigo-400 font-semibold'
                    }`}
                  >
                    {brand === 'cafe' ? 'Cafe' : 'Store'}
                  </span>

                  {/* Subtle Hover Switch Indicator */}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-normal">
                    Switch to {brand === 'cafe' ? 'Store' : 'Cafe'}
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop Links (Dynamic with smooth fade) */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <div
                className={`flex items-center space-x-8 transition-all duration-200 ${
                  isTransitioning ? 'opacity-0 translate-y-0.5' : 'opacity-100 translate-y-0'
                }`}
              >
                {currentLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-sm font-medium text-gray-900 hover:text-white transition-colors px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
              >
                Log in
              </button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
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
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-6 space-y-3">
            <div
              className={`space-y-1 transition-opacity duration-200 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {currentLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Close mobile menu when a link is clicked
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsLoginOpen(true); // Open Modal
                  setIsOpen(false);     // Close Mobile Menu
                }}
                className="w-full text-center text-sm font-medium text-gray-900 hover:text-white transition-colors px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
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
    </>
  );
}