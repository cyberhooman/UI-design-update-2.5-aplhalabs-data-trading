
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Pin, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarEvent {
  id: string;
  currency: string;
  time: string;
  name: string;
  impact: 'High' | 'Medium' | 'Low';
  date: string; // YYYY-MM-DD
}

const G8_FLAGS: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  NZD: '🇳🇿',
  CHF: '🇨🇭',
  // Support 2-letter codes from screenshot too
  US: '🇺🇸',
  EU: '🇪🇺',
  GB: '🇬🇧',
  JP: '🇯🇵',
  AU: '🇦🇺',
  CA: '🇨🇦',
  NZ: '🇳🇿',
  CH: '🇨🇭',
};

// Define EventCard outside to avoid recreation on every render and fix key prop typing issues
const EventCard = ({ event }: { event: CalendarEvent }) => (
  <div className="bg-[#1a202e] border border-[#30363d] rounded-lg p-3 hover:bg-[#21283b] transition-all cursor-pointer group shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-200">{event.currency}</span>
        <span className="text-xs font-mono font-bold text-gray-100">{event.time}</span>
        <span className="text-base leading-none">{G8_FLAGS[event.currency] || '🌐'}</span>
      </div>
      <Pin size={12} className="text-pink-500 fill-pink-500/20" />
    </div>
    <div className="text-[11px] font-medium text-gray-300 leading-tight group-hover:text-blue-400 transition-colors">
      {event.name}
    </div>
  </div>
);

const MOCK_WEEKLY_EVENTS: CalendarEvent[] = [
  // Thursday
  { id: '1', currency: 'NZ', time: '04:45', name: 'GDP q/q', impact: 'High', date: '2025-12-18' },
  { id: '2', currency: 'GB', time: '19:00', name: 'Monetary Policy Summary', impact: 'High', date: '2025-12-18' },
  { id: '3', currency: 'GB', time: '19:00', name: 'MPC Official Bank Rate Votes', impact: 'High', date: '2025-12-18' },
  { id: '4', currency: 'GB', time: '19:00', name: 'Official Bank Rate', impact: 'High', date: '2025-12-18' },
  { id: '5', currency: 'GB', time: '19:30', name: 'BOE Gov Bailey Speaks', impact: 'High', date: '2025-12-18' },
  { id: '6', currency: 'EU', time: '20:15', name: 'Main Refinancing Rate', impact: 'High', date: '2025-12-18' },
  { id: '7', currency: 'EU', time: '20:15', name: 'Monetary Policy Statement', impact: 'High', date: '2025-12-18' },
  { id: '8', currency: 'US', time: '20:30', name: 'CPI y/y', impact: 'High', date: '2025-12-18' },
  { id: '9', currency: 'US', time: '20:30', name: 'Unemployment Claims', impact: 'High', date: '2025-12-18' },
  { id: '10', currency: 'EU', time: '20:45', name: 'ECB Press Conference', impact: 'High', date: '2025-12-18' },
  // Friday
  { id: '11', currency: 'JP', time: '10:30', name: 'BOJ Policy Rate', impact: 'High', date: '2025-12-19' },
  { id: '12', currency: 'JP', time: '10:30', name: 'Monetary Policy Statement', impact: 'High', date: '2025-12-19' },
  { id: '13', currency: 'JP', time: '13:30', name: 'BOJ Press Conference', impact: 'High', date: '2025-12-19' },
  { id: '14', currency: 'GB', time: '14:00', name: 'Retail Sales m/m', impact: 'High', date: '2025-12-19' },
];

const WeeklyCalendarView: React.FC = () => {
  // Use Dec 15, 2025 as starting point for this view to match screenshot
  const [currentWeekStart] = useState(new Date(2025, 11, 15)); 
  const todayStr = '2025-12-17'; // Mocking today for visual match

  const getDaysOfWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const days = getDaysOfWeek();

  return (
    <div className="h-full flex flex-col bg-[#0b0e14] overflow-hidden p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <CalendarIcon className="text-blue-400" size={24} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Weekly Calendar</h1>
        </div>
        <p className="text-xs text-gray-400 font-medium opacity-80 uppercase tracking-widest">
          High-impact events, CB speeches, and Trump schedule
        </p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-8 shrink-0 px-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-xs font-bold text-gray-300 hover:bg-[#21262d] transition-all">
          <ChevronLeft size={16} /> Previous Week
        </button>

        <div className="text-lg font-display font-bold text-white tracking-wide">
          Dec 15 - Dec 21, 2025
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-xs font-bold text-gray-300 hover:bg-[#21262d] transition-all">
          Next Week <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="grid grid-cols-7 gap-4 min-w-[1200px] h-full pb-6">
          {days.map((day) => {
            const dateStr = day.toISOString().split('T')[0];
            const isToday = dateStr === todayStr;
            const dayName = day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            const dayNum = day.getDate();
            const monthName = day.toLocaleDateString('en-US', { month: 'short' });
            
            const dayEvents = MOCK_WEEKLY_EVENTS.filter(e => e.date === dateStr);

            return (
              <div 
                key={dateStr}
                className={`flex flex-col h-full bg-[#161b22]/40 border rounded-2xl transition-all ${
                  isToday 
                  ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50' 
                  : 'border-[#30363d]'
                }`}
              >
                {/* Day Header */}
                <div className="p-4 border-b border-[#30363d] flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className={`text-[10px] font-bold tracking-widest ${isToday ? 'text-blue-400' : 'text-gray-500'}`}>
                      {dayName}
                    </span>
                    {isToday && (
                      <span className="text-[9px] bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded uppercase">Today</span>
                    )}
                  </div>
                  <div className={`text-2xl font-display font-bold ${isToday ? 'text-white' : 'text-gray-400'}`}>
                    {dayNum}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-gray-600 uppercase">
                    {monthName}
                  </div>
                </div>

                {/* Day Content */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar-thin">
                  {dayEvents.length > 0 ? (
                    dayEvents.map(event => <EventCard key={event.id} event={event} />)
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-600 text-[10px] font-mono uppercase tracking-widest italic opacity-50">
                      No events
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendarView;
