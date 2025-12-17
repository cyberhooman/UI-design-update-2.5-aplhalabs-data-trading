import React, { useState, useEffect } from 'react';
import { EconomicEvent } from '../types';

interface CountdownBlockProps {
  event: EconomicEvent;
}

const CountdownBlock: React.FC<CountdownBlockProps> = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventTime = new Date(event.date).getTime();
      const now = new Date().getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      } else {
        setTimeLeft("00:00:00");
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); 

    return () => clearInterval(timer);
  }, [event.date]);

  return (
    <div className="h-full w-full bg-notion-overlay backdrop-blur-xl border border-notion-border rounded-2xl p-6 flex flex-col relative overflow-hidden group shadow-2xl transition-colors duration-300">
        {/* Subtle internal gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-notion-hover/10 to-transparent opacity-50 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700" />
        
        <div className="flex items-center justify-between relative z-10 mb-4">
            <span className="text-[10px] font-bold font-mono text-blue-500 dark:text-blue-300 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Next Event</span>
            {event.isAuto && (
                <div className="flex items-center gap-1.5">
                     <span className="text-[9px] font-mono text-green-500 dark:text-green-400 opacity-80">AUTO</span>
                     <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></span>
                </div>
            )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <div className="text-5xl xl:text-6xl font-display font-bold text-notion-text tracking-wider tabular-nums leading-none mb-4 drop-shadow-sm">
                {timeLeft}
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-500 dark:text-blue-400 bg-blue-500/10 px-1.5 rounded">[{event.currency}]</span>
                    <span className="text-notion-muted text-sm font-medium font-display tracking-wide">{event.name}</span>
                </div>
                <div className="text-xs text-notion-muted font-mono mt-2 opacity-60">
                    {new Date(event.date).toLocaleTimeString([], { hour12: false })} LOCAL
                </div>
            </div>
        </div>
    </div>
  );
};

export default CountdownBlock;