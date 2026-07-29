import { useState } from 'react';
import PageHeader from '../components/PageHeader';

import { BRANCHES, type Branch } from '../data/AboutData';

// Helper to determine if a branch is currently open
function getBranchStatus(schedule: Branch['schedule']): { isOpen: boolean; text: string } {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const currentHour = now.getHours() + now.getMinutes() / 60;

  const todaySchedule = schedule.find((item) => item.daysOfWeek.includes(currentDay));

  if (!todaySchedule || (todaySchedule.openHour === 0 && todaySchedule.closeHour === 0)) {
    return { isOpen: false, text: 'Closed Today' };
  }

  const isOpen = currentHour >= todaySchedule.openHour && currentHour < todaySchedule.closeHour;

  return {
    isOpen,
    text: isOpen ? 'Open Now' : 'Closed Now',
  };
}

export default function AboutPage() {
  const [selectedBranchForModal, setSelectedBranchForModal] = useState<Branch | null>(null);

  return (
    <section className="px-4 sm:px-6 bg-bg-base text-text-body min-h-screen">
      {/* Header */}
      <PageHeader
        badge="Atomik Branches"
        title="Our Locations"
        description="Visit us at any of our 2 branches or order ahead."
      />

      {/* Branch Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {BRANCHES.map((branch) => {
          const status = getBranchStatus(branch.schedule);

          return (
            <div
              key={branch.id}
              className="group relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-800/60 transition-all duration-300 flex flex-col"
            >
              {/* Clickable Map Image Container */}
              <a
                href={branch.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-56 w-full overflow-hidden block bg-zinc-900 group/map"
                title="Click to view on Google Maps"
              >
                <img
                  src={branch.mapImageUrl}
                  alt={`${branch.name} Map Location`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/map:scale-105 filter brightness-90 group-hover/map:brightness-100"
                />
              </a>

              {/* Content Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6 text-zinc-100">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                      {branch.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{branch.name}</h3>
                  </div>

                  <div className="space-y-2.5 text-sm text-zinc-300">
                    {/* Address */}
                    <p className="flex items-start gap-2.5">
                      <span className="text-zinc-500 shrink-0">📍</span>
                      <span>{branch.address}</span>
                    </p>

                    {/* Dynamic Open/Closed Status + Modal Trigger */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-zinc-500 shrink-0">🕒</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          status.isOpen
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        {status.text}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedBranchForModal(branch)}
                        className="text-xs text-amber-500 hover:text-amber-400 underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        View operating hours
                      </button>
                    </div>

                    {/* Phone */}
                    <p className="flex items-center gap-2.5">
                      <span className="text-zinc-500 shrink-0">📞</span>
                      <span>{branch.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Direct Redirect Link */}
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-zinc-900 hover:bg-amber-800 text-white font-medium py-2.5 rounded-lg border border-zinc-800 hover:border-amber-700 transition-colors duration-200 text-sm flex items-center justify-center gap-2"
                >
                  Get Directions
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Internal Operating Hours Modal */}
      {selectedBranchForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          {/* Backdrop Click Handler */}
          <div
            className="fixed inset-0"
            onClick={() => setSelectedBranchForModal(null)}
          />
          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-bg-surface border border-border rounded-2xl p-6 shadow-2xl z-10 text-text-body">            
            {/* Modal Title */}
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                Operating Schedule
              </span>
              <h3 className="text-xl text-text-heading font-bold mt-1">{selectedBranchForModal.name}</h3>
              <p className="text-xs text-text-muted mt-1">{selectedBranchForModal.address}</p>
            </div>

            {/* Schedule List */}
            <div className="space-y-3 border-t border-b border-border py-4">
              {selectedBranchForModal.schedule.map((slot, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-text-body font-medium">{slot.days}</span>
                  <span className="text-gray-700 font-mono text-xs">{slot.hoursDisplay}</span>
                </div>
              ))}
            </div>

            {/* Close Modal Action */}
            <div className="mt-6">
              <button
                onClick={() => setSelectedBranchForModal(null)}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-badge text-badge-text hover:opacity-90 transition-opacity cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}