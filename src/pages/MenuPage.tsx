import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import type { Product, DBTable } from '../data/database';
import { getAvailableProducts, getCategories } from '../services/products'; // Adjust the import path as needed
import { convertPriceToString, convertStringToPrice } from '../lib/utils';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<DBTable<'category'>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Store active category ID (or 'All'). Using ID or label string depending on your UI
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'All'>('All');

  // Fetch Products from Supabase Database
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getAvailableProducts(),
          getCategories(),
        ]);

        console.log({categoriesData});
        
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('Failed to load menu data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter products directly using category_id
  const filteredProducts = products.filter((item) => {
    if (activeCategoryId === 'All') return true;
    return item.category_id === activeCategoryId;
  });

  // Filter "New Arrivals" / Featured Items
  const newArrivals = products.filter((item) => item.badge?.toUpperCase() === "NEW");

  // Dynamic Subcategory List
  const subcategories = Array.from(
    new Set(filteredProducts.map((item) => item.sub_category_?.toString() || 'General'))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-bg-base text-white">
        <p className="animate-pulse text-zinc-400">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-bg-base text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  const getCategoryName = (id: number | undefined) => {
    if (!id) return 'Uncategorized';
    const cat = categories.find((c: any) => c.id === id);
    return cat?.label || `Category ${id}`;
  };

  return (
    <div className="px-4 sm:px-6 bg-bg-base text-text-body min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* --- NEW ARRIVALS SECTION --- */}
        {newArrivals.length > 0 && (
          <section id="new-arrivals" className="cursor-default">
            <div className="max-w-4xl mx-auto">
              <PageHeader
                badge="Atomik Specials"
                title="Discover our Signature Dishes"
                description="Explore our most popular menu items and seasonal favorites."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newArrivals.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-amber-800/60 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-zinc-900">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                        No Image Available
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                    {item.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-amber-800/90 text-amber-100 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md">
                          {item.badge}
                        </span>
                      </div>
                    )}

                    {item.variant?.[0]?.price && (
                      <div className="absolute bottom-3 right-3 bg-amber-500/90 text-white font-bold text-sm px-3 py-1 rounded-full border border-zinc-800 shadow-md">
                        {convertPriceToString(item.variant[0].price)}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        {getCategoryName(item.category_id)}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- FULL MENU SECTION --- */}
        <section id="full-menu" className="pt-6 border-t border-zinc-900">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="cursor-default">
              <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">
                Explore Everything
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Full Menu Details
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {/* Manual 'All' Button */}
              <button
                onClick={() => setActiveCategoryId('All')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeCategoryId === 'All'
                    ? 'bg-amber-800 text-white shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                All
              </button>

              {categories.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Category Groups & Items */}
          {subcategories.map((subCat) => {
            const itemsInSubCat = filteredProducts.filter(
              (item) => (item.sub_category_?.toString() || 'General') === subCat
            );

            if (itemsInSubCat.length === 0) return null;

            return (
              <div key={subCat} className="mb-10 last:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold tracking-wide uppercase text-xs text-zinc-400">
                    {subCat === 'General' ? 'General' : `Sub-Category ${subCat}`}
                  </h3>
                  <div className="h-px bg-zinc-800/80 flex-1" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 cursor-pointer">
                  {itemsInSubCat.map((item) => (
                    <div
                      key={item.id}
                      className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-zinc-900"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-white">
                            {item.name}
                          </h4>
                          {item.is_popular && (
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

                      {/* Dynamic Variant Rendering */}
                      <div className="flex flex-wrap sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800/80 gap-2 min-w-28">
                        {Array.isArray(item.variant) &&
                          item.variant.map((v, idx) => (
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
          {filteredProducts.length === 0 && (
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