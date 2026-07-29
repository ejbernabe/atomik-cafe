export interface PromoItem {
  id: string;
  day: string;
  promo: string;
  deal: string;
  time: string;
  img?: string;
}

export const SCHEDULES: PromoItem[] = [
  { id: 'schedule0', day: 'All Week', promo: '@/Free Drink', deal: 'Get 1 Spanish Latte or 1 Strawberry Milk.', time: 'All Day', img: '/promo-tag.jpg' },
  { id: 'schedule1', day: 'Monday', promo: 'Free Upsize', deal: 'Buy any drink and get a free upsize.', time: 'All Day', img: '/promo-big-cup.jpg' },
  { id: 'schedule2', day: 'Friday', promo: 'Buy 2 & Get 1 Free', deal: 'Buy 2 drinks and get 1 FREE.', time: 'All Day', img: '/promo-b2t1.jpg' },
];