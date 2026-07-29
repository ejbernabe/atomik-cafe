export interface Branch {
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

export const BRANCHES: Branch[] = [
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