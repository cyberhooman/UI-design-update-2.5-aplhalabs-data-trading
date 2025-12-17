import { EconomicEvent, NewsItem, CBSpeech } from './types';

export const UPCOMING_EVENTS: EconomicEvent[] = [
  {
    id: '1',
    currency: 'GBP',
    name: 'CPI y/y',
    date: '2025-12-17T14:00:00+07:00',
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
  }
];

export const MOCK_CB_SPEECHES: CBSpeech[] = [
  {
    id: 'cb-1',
    currency: 'JPY',
    date: '2025-12-17',
    speaker: 'Central Bank Official',
    content: "Japan government panel member Nagahama: BoJ's monetary policy appears to be influenced heavily by FX moves.",
    sourceUrl: '#'
  },
  {
    id: 'cb-2',
    currency: 'USD',
    date: '2025-12-16',
    speaker: 'Central Bank Official',
    content: "Fed's Bostic Speech on 'FOMC's Credibility on Inflation Could Be at Stake'",
    sourceUrl: '#'
  },
  {
    id: 'cb-3',
    currency: 'USD',
    date: '2025-12-15',
    speaker: 'Central Bank Official',
    content: "Fed's Miran sees no material impact from tariffs on inflation — CNBC Interview.",
    sourceUrl: '#'
  },
  {
    id: 'cb-4',
    currency: 'USD',
    date: '2025-12-15',
    speaker: 'Williams',
    content: "Fed's Williams: Gradual cooling in the job market points to modestly restrictive monetary policy.",
    sourceUrl: '#'
  },
  {
    id: 'cb-5',
    currency: 'JPY',
    date: '2025-12-15',
    speaker: 'Central Bank Official',
    content: "BOJ to start selling ETF holdings as early as January: says",
    sourceUrl: '#',
    bias: { label: 'HAWKISH', score: 75 }
  }
];