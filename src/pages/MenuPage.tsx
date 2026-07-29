import { useState } from 'react';
import PageHeader from '../components/PageHeader';

import { NEW_ARRIVALS, MENU_CATEGORIES, FULL_MENU } from '../data/MenuData';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filter items based on active tab
  const filteredMenuItems = activeCategory === 'All'
    ? FULL_MENU
    : FULL_MENU.filter((item) => item.category === activeCategory);

  const subcategories = Array.from(
    new Set(filteredMenuItems.map((item) => item.subCategory || 'General'))
  );

  return (
    <div className="px-4 sm:px-6 bg-bg-base text-text-body min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">

        <section id="new-arrivals" className="cursor-default">
          <div className="max-w-4xl mx-auto">
            <PageHeader
              badge="Atomik Specials"
              title="Discover our Signature Dishes"
              description="Explore our most popular menu items and seasonal favorites."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEW_ARRIVALS.map((item) => (
              <div
                key={item.id}
                className="group relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-amber-800/60 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden bg-zinc-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-800/90 text-amber-100 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md">
                      {item.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-amber-500/90 text-white font-bold text-sm px-3 py-1 rounded-full border border-zinc-800 shadow-md">
                    {item.variant[0].price}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="full-menu" className="pt-6 border-t border-zinc-900">
          {/* Section Header & Main Category Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="cursor-default">
              <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">
                Explore Everything
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Full Menu Details
              </h2>
            </div>

            {/* Main Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {MENU_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Category Groups & Items */}
          {subcategories.map((subCat) => {
            // Get items belonging to this subcategory
            const itemsInSubCat = filteredMenuItems.filter(
              (item) => (item.subCategory || 'General') === subCat
            );

            if (itemsInSubCat.length === 0) return null;

            return (
              <div key={subCat} className="mb-10 last:mb-0">
                {/* Sub-Category Heading */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold tracking-wide uppercase text-xs text-zinc-900">
                    {subCat}
                  </h3>
                  <div className="h-px bg-zinc-800/80 flex-1" />
                </div>

                {/* Menu Items Grid for this Sub-Category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 cursor-pointer">
                  {itemsInSubCat.map((item) => (
                    <div
                      key={item.id}
                      className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-zinc-900"
                    >
                      {/* Left: Item Info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-white">
                            {item.name}
                          </h4>
                          {item.isPopular && (
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              POPULAR
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Right: Variants & Pricing */}
                      <div className="flex flex-wrap sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800/80 gap-2 min-w-28">
                        {item.variant.map((v, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs sm:text-sm">
                            {v.label && (
                              <span className="text-zinc-400 font-medium text-xs">
                                {v.label}
                              </span>
                            )}
                            <span className="font-bold text-amber-400">
                              {v.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800">
              <p className="text-zinc-400 text-sm">
                No menu items found in this category.
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}