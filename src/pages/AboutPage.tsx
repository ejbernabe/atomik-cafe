interface Branch {
  id: string;
  name: string;
  tagline: string;
  address: string;
  hours: string;
  phone: string;
  mapImageUrl: string;
  googleMapsUrl: string;
}

const BRANCHES: Branch[] = [
  {
    id: 'branch-dahlia',
    name: 'Atomik Dahlia Branch',
    tagline: 'Flagship Store & Coffee Roastery',
    address: '6 Falcon St, Quezon City, 1127 Metro Manila',
    hours: 'Mon - Fri: 9:00 AM - 10:00 PM, Sat - Sun: 9:00 AM - 12:00 AM',
    phone: '+1 (555) 019-2834',
    // Replace with your Google Static Map API URL or local map screenshot
    mapImageUrl: '/branch-dahlia.jpg',
    googleMapsUrl: 'https://maps.google.com/?q=Atomik+Cafe+Dahlia',
  },
  {
    id: 'branch-regalado',
    name: 'Atomik Regalado Branch',
    tagline: 'Express Cafe & Bakery',
    address: '87 Regalado Hwy, Novaliches, Quezon City, Metro Manila',
    hours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    phone: '+1 (555) 014-9821',
    mapImageUrl: '/branch-regalado.jpg',
    googleMapsUrl: 'https://maps.google.com/?q=Atomik+Cafe+Regalado',
  },
];

export default function AboutPage() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">Our Locations</h2>
        <p className="text-zinc-400 mt-2">Visit us at any of our 2 branches or order ahead.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {BRANCHES.map((branch) => (
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

              {/* Hover Badge Overlay */}
              {/* WIP */}
              {/* <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/map:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-amber-800 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Open in Google Maps
                </span>
              </div> */}
            </a>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-zinc-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                  {branch.tagline}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{branch.name}</h3>
                
                <div className="mt-4 space-y-2 text-sm text-zinc-300">
                  <p className="flex items-start gap-2">
                    <span className="text-zinc-500">📍</span>
                    {branch.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-zinc-500">🕒</span>
                    {branch.hours}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-zinc-500">📞</span>
                    {branch.phone}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}