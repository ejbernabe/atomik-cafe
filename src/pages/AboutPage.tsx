import { useState } from 'react';
import PageHeader from '../components/PageHeader';

interface Branch {
  id: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
  mapImageUrl: string;
  googleMapsUrl: string;
  // Structured schedule for calculation
  schedule: {
    days: string;
    hoursDisplay: string;
    // Open/Close hours in 24-hour format [openHour, closeHour]
    daysOfWeek: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
    openHour: number;
    closeHour: number; // Use 24 for midnight
  }[];
}

const BRANCHES: Branch[] = [
  {
    id: 'branch-dahlia',
    name: 'Atomik Dahlia Branch',
    tagline: 'Flagship Store & Coffee Roastery',
    address: '6 Falcon St, Quezon City, 1127 Metro Manila',
    phone: '+1 (555) 019-2834',
    mapImageUrl: '/branch-dahlia.jpg',
    googleMapsUrl: 'https://maps.google.com/?q=Atomik+Cafe+Dahlia',
    schedule: [
      {
        days: 'Monday - Friday',
        hoursDisplay: '9:00 AM - 10:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
        openHour: 9,
        closeHour: 22,
      },
      {
        days: 'Saturday - Sunday',
        hoursDisplay: '9:00 AM - 12:00 AM',
        daysOfWeek: [0, 6],
        openHour: 9,
        closeHour: 24, // Midnight
      },
    ],
  },
  {
    id: 'branch-regalado',
    name: 'Atomik Regalado Branch',
    tagline: 'Express Cafe & Bakery',
    address: '87 Regalado Hwy, Novaliches, Quezon City, Metro Manila',
    phone: '+1 (555) 014-9821',
    mapImageUrl: '/branch-regalado.jpg',
    googleMapsUrl: 'https://maps.google.com/?q=Atomik+Cafe+Regalado',
    schedule: [
      {
        days: 'Monday - Saturday',
        hoursDisplay: '9:00 AM - 9:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        openHour: 9,
        closeHour: 21,
      },
      {
        days: 'Sunday',
        hoursDisplay: 'Closed',
        daysOfWeek: [0],
        openHour: 0,
        closeHour: 0,
      },
    ],
  },
];

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop Click Handler */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedBranchForModal(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 text-white">
            {/* Modal Title */}
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                Operating Schedule
              </span>
              <h3 className="text-xl text-zinc-200 font-bold mt-1">{selectedBranchForModal.name}</h3>
              <p className="text-xs text-zinc-400 mt-1">{selectedBranchForModal.address}</p>
            </div>

            {/* Schedule List */}
            <div className="space-y-3 border-t border-b border-zinc-800 py-4">
              {selectedBranchForModal.schedule.map((slot, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-zinc-300 font-medium">{slot.days}</span>
                  <span className="text-amber-400 font-mono text-xs">{slot.hoursDisplay}</span>
                </div>
              ))}
            </div>

            {/* Close Modal Action */}
            <div className="mt-6">
              <button
                onClick={() => setSelectedBranchForModal(null)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2 rounded-lg border border-zinc-700 transition-colors cursor-pointer text-sm"
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