export interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

export const SLIDES: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1920&auto=format&fit=crop',
    title: 'Artisanal Coffee & Fresh Bakes',
    subtitle: 'Hand-crafted beverages made with locally roasted beans every single day.',
    ctaText: 'View Menu',
    ctaLink: '/menu',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1920&auto=format&fit=crop',
    title: 'Cozy Atmosphere, Modern Vibe',
    subtitle: 'Find your perfect spot to work, relax, or catch up with friends.',
    ctaText: 'Find Locations',
    ctaLink: '/about',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1920&auto=format&fit=crop',
    title: 'Weekly Specials & Promotions',
    subtitle: 'Discover our rotating seasonal syrups and exclusive daily discounts.',
    ctaText: 'Explore Promos',
    ctaLink: '/promos',
  },
];