import { useState } from 'react';
import { DropPaiwan } from '../components/DropPaiwan';
import { ClaimPaiwan } from '../components/ClaimPaiwan';

export default function PaiwanPage() {
  const [activeTab, setActiveTab] = useState('drop');

  // Active tab matches card body (bg-base-100), no bottom rounding, no borders
  const activeClass = 'bg-base-100 text-base-content font-semibold rounded-t-lg rounded-b-none';
  const inactiveClass = 'text-base-content hover:text-base-content hover:bg-base-200/40 rounded-lg';

  return (
    <section className="w-full px-4 sm:px-6 flex justify-center py-10">
      <div className="card max-w w-full mx-auto bg-base-100 shadow-xl overflow-hidden rounded-xl">
        
        {/* Nav with NO padding so active tab sits directly flush on the content area */}
        <nav className="flex bg-neutral/80" aria-label="Tabs" role="tablist">
          <button
            type="button"
            className={`uppercase flex-1 py-3 px-4 text-center text-sm font-medium transition-all ${
              activeTab === 'drop' ? activeClass : inactiveClass
            }`}
            onClick={() => setActiveTab('drop')}
            role="tab"
            aria-selected={activeTab === 'drop'}
          >
            DROP
          </button>

          <button
            type="button"
            className={`uppercase flex-1 py-3 px-4 text-center text-sm font-medium transition-all ${
              activeTab === 'claim' ? activeClass : inactiveClass
            }`}
            onClick={() => setActiveTab('claim')}
            role="tab"
            aria-selected={activeTab === 'claim'}
          >
            Claim
          </button>
        </nav>

        {/* Card Body sits flush under the active tab */}
        <div className="card-body p-6">
          <div className={activeTab === 'drop' ? '' : 'hidden'} role="tabpanel">
            <DropPaiwan />
          </div>

          <div className={activeTab === 'claim' ? '' : 'hidden'} role="tabpanel">
            <ClaimPaiwan />
          </div>
        </div>
      </div>
    </section>
  );
}