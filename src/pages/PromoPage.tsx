import { useState } from 'react';
import PromoModal, { type PromoItem } from '../components/PromoModal';

export default function PromoPage() {
  const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);

  const schedule: PromoItem[] = [
    { id: 'schedule0', day: 'All Week', promo: '@/Free Drink', deal: 'Get 1 Spanish Latte or 1 Strawberry Milk.', time: 'All Day', img: '/promo-tag.jpg' },
    { id: 'schedule1', day: 'Monday', promo: 'Free Upsize', deal: 'Buy any drink and get a free upsize.', time: 'All Day', img: '/promo-big-cup.jpg' },
    { id: 'schedule2', day: 'Friday', promo: 'Buy 2 & Get 1 Free', deal: 'Buy 2 drinks and get 1 FREE.', time: 'All Day', img: '/promo-b2t1.jpg' },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 bg-bg-base text-text-body min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold text-badge-text uppercase tracking-widest bg-badge px-3.5 py-1 rounded-full shadow-sm">
            Atomik Specials
          </span>
          <h1 className="text-3xl font-black text-text-heading mt-3 sm:text-4xl tracking-tight">
            Weekly Deals Schedule
          </h1>
          <p className="text-text-muted font-medium text-sm mt-2 max-w-md mx-auto">
            Plan your visits around our recurring weekly offers and daily specials.
          </p>
        </div>

        {/* Encapsulated Scrollable Card Container */}
        <div className="max-h-150 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-bg-surface">
          {schedule.slice(0, 10).map((item, idx) => (
            <div 
              key={item.id || idx} 
              onClick={() => setSelectedPromo(item)}
              className="bg-bg-surface text-text-body rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl border border-border hover:border-border-hover hover:bg-bg-sunken transition-all duration-200 cursor-pointer"
            >
              <div>
                <span className="text-xs font-black text-text-muted uppercase tracking-widest">
                  {item.day}
                </span>
                <h3 className="text-lg font-bold text-text-heading mt-0.5">
                  {item.promo}
                </h3>
                <p className="text-text-muted text-sm mt-1">
                  {item.deal}
                </p>
              </div>

              <span className="bg-bg-sunken border border-border text-text-heading text-xs px-3.5 py-1.5 rounded-full font-mono font-bold whitespace-nowrap">
                ⏰ {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Render the clean, isolated Modal Component */}
      <PromoModal 
        item={selectedPromo} 
        onClose={() => setSelectedPromo(null)} 
      />
    </div>
  );
}