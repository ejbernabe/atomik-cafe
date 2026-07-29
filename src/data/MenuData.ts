export interface MenuItem {
  name: string;
  id: string;
  description?: string;
  variant: {
    label: string,
    price: string,
  }[];
  category: string;
  subCategory?: string;
  isPopular?: boolean;
}

export interface NewMenuItem extends MenuItem {
  image: string;
  badge: string;
}

// --- DATA ---
export const NEW_ARRIVALS: NewMenuItem[] = [
  { name: 'Roasted Chicken Meal',
    id: 'new-1',
    description: 'Comes with Rice and Side Waffles. Add P50 for a 22oz Iced Tea. Add P100 for Unli Rice and Unli Iced Tea.',
    variant: [{
      label: '',
      price: '*P150',
    }],
    category: 'Rice Meal',
    badge: 'NEW ARRIVAL',
    image: '/featured-1.jpg',
    isPopular: true,
  },
  { name: 'Ube Waffles',
    id: 'new-2',
    description: 'Comes with a cup of Vietnamese Coffee.',
    variant: [{
      label: '',
      price: 'P125',
    }],
    category: 'Snacks',
    badge: 'NEW ARRIVAL',
    image: '/featured-2.jpg',
  },
  { name: 'Smoked Honey & Sea Salt Latte',
    id: 'new-3',
    description: 'Espresso with steamed oat milk, local raw smoked honey, and sea salt flakes.',
    variant: [{
      label: '',
      price: 'P50',
    }],
    category: 'Espresso',
    badge: "CHEF'S PICK",
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800',
  },
];

export const MENU_CATEGORIES = ['All', 'Drinks', 'Pastries', 'Snacks', 'All-Day Breakfast', 'Rice Bowls', 'Pasta'];

export const FULL_MENU: MenuItem[] = [
  // Espresso
  { name: 'Vietnamese Coffee',
    id: '0001',
    variant: [{
      label: '16oz',
      price: 'P75',
    }],
    category: 'Drinks',
    subCategory: 'Classic Iced',
  },
  { name: 'Cloud Coffee',
    id: '0002',
    variant: [{
      label: '16oz',
      price: 'P75',
    }],
    category: 'Drinks',
    subCategory: 'Classic Iced',
  },
  { name: 'Iced Americano',
    id: '0003',
    variant: [{
      label: '16oz',
      price: 'P85',
    },{
      label: '22oz',
      price: 'P140',
    }
    ],
    category: 'Drinks',
    subCategory: 'Classic Iced',
  },
  { name: 'Cafe Latte',
    id: '0004',
    variant: [{
      label: '16oz',
      price: 'P100',
    },{
      label: '22oz',
      price: 'P150',
    }],
    category: 'Drinks',
    subCategory: 'Classic Iced',
  },
  { name: 'Spanish Latte',
    id: '0005',
    variant: [{
      label: '16oz',
      price: 'P120',
    },{
      label: '22oz',
      price: 'P180',
    }],
    category: 'Drinks',
    subCategory: 'Classic Iced',
    isPopular: true,
  },
  { name: 'Cold Brew & Cream',
    id: '0006',
    variant: [{
      label: '16oz',
      price: 'P100',
    },{
      label: '22oz',
      price: 'P150',
    }],
    category: 'Drinks',
    subCategory: 'Classic Iced',
  },
]