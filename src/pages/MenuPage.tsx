import { useState } from 'react';
import PageHeader from '../components/PageHeader';

// --- TYPES ---
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  subCategory?: string;
  isPopular?: boolean;
}

interface NewMenuItem extends MenuItem {
  image: string;
  badge: string;
}

// --- DATA ---
const NEW_ARRIVALS: NewMenuItem[] = [
  {
    id: 'new-1',
    name: 'Roasted Chicken Meal',
    description: 'Comes with Rice and Side Waffles. Add P50 for a 22oz Iced Tea. Add P100 for Unli Rice and Unli Iced Tea.',
    price: '*P150.00',
    category: 'Rice Meal',
    badge: 'NEW ARRIVAL',
    image: '/featured-1.jpg',
    isPopular: true,
  },
  {
    id: 'new-2',
    name: 'Ube Waffles',
    description: 'Comes with a cup of Vietnamese Coffee.',
    price: 'P125.00',
    category: 'Snacks',
    badge: 'NEW ARRIVAL',
    image: '/featured-2.jpg',
  },
  {
    id: 'new-3',
    name: 'Smoked Honey & Sea Salt Latte',
    description: 'Espresso with steamed oat milk, local raw smoked honey, and sea salt flakes.',
    price: '$6.25',
    category: 'Espresso',
    badge: "CHEF'S PICK",
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800',
  },
];

const MENU_CATEGORIES = ['All', 'Drinks', 'Pastries', 'Snacks', 'All-Day Breakfast', 'Rice Bowls', 'Pasta'];

const FULL_MENU: MenuItem[] = [
  // Espresso
  { id: 'm-1', name: 'Atomik Espresso Shot', description: 'Double shot of rich espresso with warm notes of dark chocolate & hazelnut.', price: '$3.50', category: 'Espresso', isPopular: true },
  { id: 'm-2', name: 'Spanish Latte', description: 'Double shot espresso combined with fresh milk and sweetened condensed milk.', price: '$5.50', category: 'Espresso', isPopular: true },
  { id: 'm-3', name: 'Caramel Macchiato', description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and drizzle.', price: '$5.75', category: 'Espresso' },
  { id: 'm-4', name: 'Americano', description: 'Espresso shots topped with hot water to produce a light layer of crema.', price: '$4.25', category: 'Espresso' },
  
  // Cold Brew
  { id: 'm-5', name: 'Signature Vanilla Cold Brew', description: 'Steeped for 20 hours, infused with pure Madagascar vanilla extract.', price: '$5.50', category: 'Cold Brew' },
  { id: 'm-6', name: 'Nitro Cold Brew', description: 'Infused with nitrogen for a naturally sweet flavor and smooth creamy cascade.', price: '$6.00', category: 'Cold Brew', isPopular: true },
  { id: 'm-7', name: 'Coconut Cream Cold Brew', description: 'Smooth cold brew topped with lightly sweetened coconut cream foam.', price: '$6.25', category: 'Cold Brew' },

  // Pastries
  { id: 'm-8', name: 'Classic Butter Croissant', description: 'Traditional French croissant with delicate flaky layers and rich butter flavor.', price: '$4.00', category: 'Pastries' },
  { id: 'm-9', name: 'Pain au Chocolat', description: 'Laminated dough wrapped around two bars of rich dark chocolate.', price: '$4.50', category: 'Pastries', isPopular: true },
  { id: 'm-10', name: 'Almond Twice-Baked Croissant', description: 'Filled with almond cream frangipane and topped with toasted sliced almonds.', price: '$5.25', category: 'Pastries' },

  // Desserts
  { id: 'm-11', name: 'Matcha Tiramisu', description: 'Layers of espresso-soaked ladyfingers and creamy ceremonial matcha mascarpone.', price: '$6.75', category: 'Desserts' },
  { id: 'm-12', name: 'Basque Burnt Cheesecake', description: 'Caramelized crust with a rich, soft, and creamy center.', price: '$7.00', category: 'Desserts', isPopular: true },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filter items based on active tab
  const filteredMenuItems = activeCategory === 'All'
    ? FULL_MENU
    : FULL_MENU.filter((item) => item.category === activeCategory);

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

                  <div className="absolute bottom-3 right-3 bg-zinc-950/90 text-white font-bold text-sm px-3 py-1 rounded-full border border-zinc-800 shadow-md">
                    {item.price}
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
          
          {/* Section Header & Category Filters */}
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

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 cursor-default">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-zinc-900"
              >
                {/* Left: Item Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white">
                      {item.name}
                    </h3>
                    {item.isPopular && (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                    {item.description}
                  </p>
                </div>

                {/* Right: Price & Quick Add Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800/80 gap-3 min-w-25">
                  <span className="text-base font-bold text-amber-400">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMenuItems.length === 0 && (
            <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800">
              <p className="text-zinc-400 text-sm">No menu items found in this category.</p>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}