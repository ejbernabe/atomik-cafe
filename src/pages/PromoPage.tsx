import { useEffect, useState } from 'react';
import PromoModal from '../components/PromoModal';
import { PageHeader, ToastError, LoadingMessage } from '../components/Common';
// import { SCHEDULES, type PromoItem } from '../data/PromoData';
import { getPromos } from '../services/promos';
import { type DBTable } from '../data/database';


export default function PromoPage() {
  const [promos, setPromos] = useState<DBTable<'promos'>[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<DBTable<'promos'> | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [promosData] = await Promise.all([
          getPromos(),
        ]);

        setPromos(promosData || []);
        // console.log({promos, promosData});
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to load promos. Please refresh and try again.');
      } finally {
        // setError("asdasd");
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if(loading) {
    return (
      <LoadingMessage message="Loading Promos "></LoadingMessage>
    );
  }

  if(error) {
    return (
      <ToastError message={error}></ToastError>
    );
  }

  return (
    <div className="px-4 sm:px-6 bg-bg-base text-text-body min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <PageHeader
          badge="Atomik Promos"
          title="Weekly Deals Schedule"
          description="Plan your visits around our recurring weekly offers and daily specials."
        />

        {/* Encapsulated Scrollable Card Container */}
        <div className="max-h-150 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-bg-surface">
          {promos.slice(0, 10).map((promo) => (
            <div 
              key={promo.id} 
              onClick={() => setSelectedPromo(promo)}
              className="bg-bg-surface text-text-body rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl border border-border hover:border-border-hover hover:bg-bg-sunken transition-all duration-200 cursor-pointer"
            >
              <div>
                <span className="text-xs font-black text-text-muted uppercase tracking-widest">
                  {promo.day}
                </span>
                <h3 className="text-lg font-bold text-text-heading mt-0.5">
                  {promo.label}
                </h3>
                <p className="text-text-muted text-sm mt-1">
                  {promo.description}
                </p>
              </div>

              <span className="bg-bg-sunken border border-border text-text-heading text-xs px-3.5 py-1.5 rounded-full font-mono font-bold whitespace-nowrap">
                ⏰ {promo.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Render the clean, isolated Modal Component */}
      {selectedPromo && (
        <PromoModal 
          item={selectedPromo} 
          onClose={() => setSelectedPromo(null)} 
        />
      )}
    </div>
  );
}