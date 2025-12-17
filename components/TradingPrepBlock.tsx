import React, { useState, useEffect } from 'react';
import { Info, TriangleAlert, Plus } from 'lucide-react';

const TradingPrepBlock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Sync with minute for cleaner updates
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="bg-notion-overlay backdrop-blur-xl border border-notion-border rounded-2xl p-5 flex flex-col h-full shadow-2xl font-sans text-notion-text relative overflow-hidden transition-colors duration-300">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-notion-hover/10 to-transparent opacity-50 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2 bg-notion-block/50 border border-notion-border px-3 py-1.5 rounded-md shadow-sm">
           <span className="text-xs font-semibold text-notion-muted tracking-wide">{formattedDate}</span>
           <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">{formattedTime}</span>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-bold text-notion-muted hover:text-notion-text transition-colors hover:bg-notion-hover px-2 py-1.5 rounded-md cursor-pointer">
            <Plus size={14} />
            Add Note
        </button>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-notion-text mb-5 tracking-tight relative z-10">Data Trading Preparation</h2>

      {/* Trend Section (Blue) */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-3 relative overflow-hidden group z-10 shadow-sm transition-colors">
         {/* Glow effect */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>
         
         <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1 bg-blue-500/10 rounded-full">
                    <Info size={14} className="text-blue-500 shrink-0" />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <TriangleAlert size={14} className="text-yellow-500" />
                        <span className="text-sm font-semibold text-notion-text tracking-wide">Don't fight the trend</span>
                    </div>
                </div>
            </div>
            
            <div className="pl-9 space-y-2 mt-1">
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-500 font-semibold w-16">Strongest:</span>
                    <span className="text-notion-muted font-mono">()</span>
                    <span className="text-green-500 font-bold uppercase tracking-wider text-[10px] ml-1">↑ Strong Buy%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-500 font-semibold w-16">Weakest:</span>
                    <span className="text-notion-muted font-mono">()</span>
                    <span className="text-red-500 font-bold uppercase tracking-wider text-[10px] ml-1">↓ Strong Sell%</span>
                </div>
            </div>
         </div>
      </div>

      {/* Advice Section (Yellow) */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 mb-6 relative z-10 shadow-sm transition-colors">
         <div className="flex items-start gap-3">
             <div className="mt-0.5 p-1 bg-yellow-500/10 rounded-full">
                <Info size={14} className="text-yellow-500 shrink-0" />
             </div>
             <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium leading-relaxed">
                 Only take an advantage when <span className="text-green-500 font-bold">GREEN</span> across the board or <span className="text-red-500 font-bold">RED</span> across the board
             </p>
         </div>
      </div>

      {/* Empty Notes State */}
      <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[80px] relative z-10 group cursor-pointer hover:bg-notion-hover/50 rounded-lg transition-colors border border-dashed border-notion-border/50 hover:border-notion-border">
          <p className="text-xs text-notion-muted font-medium group-hover:text-notion-text transition-colors">
              No trading notes yet. Click "+ Add Note" to start.
          </p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 text-xs font-semibold text-notion-muted relative z-10">
          Prepare your trades wisely!
      </div>
    </div>
  );
};

export default TradingPrepBlock;