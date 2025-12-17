export interface EconomicEvent {
  id: string;
  currency: string;
  name: string;
  date: string; // ISO string
  impact: 'High' | 'Medium' | 'Low';
  forecast?: string;
  previous?: string;
  isAuto?: boolean;
}

export interface NewsItem {
  id: string;
  headline: string;
  timestamp: string;
  source?: string;
  isUrgent?: boolean;
}

export interface Note {
  id: string;
  content: string;
  type: 'note' | 'warning';
  createdAt: string;
}

export interface Strategy {
  id: string;
  pair: string;
  direction: 'Neutral' | 'Long' | 'Short';
  status: 'Draft' | 'Pending' | 'Active' | 'Closed';
  thesis: string;
  timeframe: string;
  lastUpdated: string;
  aiFeedback?: string;
}

export enum NavItem {
  Dashboard = 'Dashboard',
  CurrencyStrength = 'Currency Strength',
  CBSpeeches = 'CB Speeches',
  WeeklyCalendar = 'Weekly Calendar',
  Settings = 'Settings'
}