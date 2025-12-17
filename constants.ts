import { EconomicEvent, NewsItem, Note } from './types';

export const UPCOMING_EVENTS: EconomicEvent[] = [
  {
    id: '1',
    currency: 'GBP',
    name: 'CPI y/y',
    date: '2025-12-17T14:00:00+07:00', // Matches image Wed, Dec 17, 02:00 PM GMT+7
    impact: 'High',
    isAuto: true
  },
  {
    id: '2',
    currency: 'NZD',
    name: 'GDP q/q',
    date: '2025-12-18T04:45:00+07:00',
    impact: 'High',
    isAuto: true
  },
  {
    id: '3',
    currency: 'GBP',
    name: 'Monetary Policy Summary',
    date: '2025-12-18T19:00:00+07:00',
    impact: 'High',
    isAuto: true
  }
];

export const MARKET_NEWS: NewsItem[] = [
  {
    id: '1',
    headline: "China Commerce Ministry: UN convention on cargo documents fully demonstrates China's determination and actions to uphold true multilateralism...",
    timestamp: 'Dec 17, 07:42 AM',
    isUrgent: true
  },
  {
    id: '2',
    headline: "Trump: nominating Troy Edgar as next United States ambassador to El Salvador",
    timestamp: 'Dec 17, 07:42 AM',
    isUrgent: true
  },
  {
    id: '3',
    headline: "China PBOC anticipated to set yuan mid-point near 7.0386 per dollar according to source estimate",
    timestamp: 'Dec 17, 07:40 AM',
    isUrgent: false
  }
];

export const INITIAL_NOTES: Note[] = [];