import React from 'react';
import { EconomicEvent } from '../types';
import { Calendar, MoreHorizontal, Clock } from 'lucide-react';

interface EventsListBlockProps {
  events: EconomicEvent[];
}

const EventsListBlock: React.FC<EventsListBlockProps> = ({ events }) => {
  return (
    <div className="bg-notion-overlay backdrop-blur-xl border border-notion-border rounded-2xl p-0 h-full flex flex-col overflow-hidden shadow-xl transition-colors duration-300">
      <div className="p-4 border-b border-notion-border flex items-center justify-between shrink-0 bg-notion-block/50">
        <div className="flex items-center gap-2">
            <Calendar size={14} className="text-teal-500" />
            <h3 className="text-sm font-display font-semibold text-notion-text tracking-wide">Schedule</h3>
        </div>
        <button className="text-notion-muted hover:text-notion-text">
            <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {events.map((event) => (
          <div key={event.id} className="group p-3 rounded-xl border border-notion-border bg-notion-block/50 hover:bg-notion-hover/50 hover:border-notion-border transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold text-teal-600 dark:text-teal-300 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">{event.currency}</span>
              <div className="flex items-center gap-1.5 text-[10px] text-notion-muted">
                 <Clock size={10} />
                 <span className="font-mono">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
            
            <div className="text-xs text-notion-text font-medium font-display truncate mb-2 group-hover:text-blue-500 transition-colors" title={event.name}>
                {event.name}
            </div>

             <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${event.impact === 'High' ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]' : 'bg-yellow-500'}`}></div>
                <span className="text-[9px] text-notion-muted font-mono uppercase tracking-wider">{event.impact} Impact</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsListBlock;