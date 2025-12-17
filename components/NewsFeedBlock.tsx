import React from 'react';
import { RefreshCw, Radio, ExternalLink, Loader2 } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsFeedBlockProps {
  news: NewsItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
  sources?: { title: string; uri: string }[];
}

const NewsFeedBlock: React.FC<NewsFeedBlockProps> = ({ news, isLoading, onRefresh, sources = [] }) => {
  return (
    <div className="bg-notion-overlay backdrop-blur-xl border border-notion-border rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl relative group transition-colors duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-notion-border flex items-center justify-between shrink-0 bg-notion-block/50">
         <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-500/10 rounded-md border border-red-500/20">
                <Radio size={14} className="text-red-500 animate-pulse" />
            </div>
            <h3 className="text-sm font-display font-semibold text-notion-text tracking-wide">Live Newswire</h3>
         </div>
         <div className="flex items-center gap-2">
             <span className="text-[10px] font-mono text-notion-muted hidden lg:block">
                 {isLoading ? 'FETCHING DATA...' : 'REAL-TIME'}
             </span>
             <button 
                onClick={onRefresh}
                disabled={isLoading}
                className={`p-1.5 hover:bg-notion-hover rounded-md text-notion-muted hover:text-notion-text transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                 <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
             </button>
         </div>
      </div>

      {/* Feed */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar p-0 relative ${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                    <span className="text-[10px] font-mono text-blue-500">CONNECTING TO FEED...</span>
                </div>
            </div>
        )}
        
        <div className="divide-y divide-notion-border">
            {news.map((item) => (
            <div key={item.id} className="group/item px-5 py-5 hover:bg-notion-hover/40 transition-all cursor-default relative">
                <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="font-mono text-[10px] text-notion-muted flex items-center gap-1.5">
                        {item.timestamp}
                    </span>
                    {item.isUrgent && (
                        <span className="flex items-center gap-1 text-[9px] font-bold font-mono text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                            BREAKING
                        </span>
                    )}
                </div>
                
                <h4 className={`text-sm font-display leading-relaxed ${item.isUrgent ? 'text-notion-text font-medium' : 'text-notion-text/80'} group-hover/item:text-blue-500 dark:group-hover/item:text-blue-300 transition-colors`}>
                    {item.headline}
                </h4>
                
                <div className="mt-3 flex items-center gap-3 opacity-0 group-hover/item:opacity-100 transition-opacity transform translate-y-1 group-hover/item:translate-y-0 duration-200">
                    <button className="text-[10px] flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors font-medium">
                        View Context <ExternalLink size={10} />
                    </button>
                </div>
            </div>
            ))}
        </div>
      </div>
      
      {/* Source Ticker / Footer */}
      {sources.length > 0 && (
          <div className="px-4 py-2 border-t border-notion-border bg-notion-block/60 backdrop-blur-md shrink-0">
             <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[9px] font-bold text-notion-muted shrink-0 uppercase tracking-wider">Sources:</span>
                <div className="flex gap-3 animate-marquee whitespace-nowrap">
                   {sources.map((source, idx) => (
                       <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] text-notion-muted hover:text-blue-500 transition-colors font-mono truncate max-w-[150px]">
                           {source.title}
                       </a>
                   ))}
                </div>
             </div>
          </div>
      )}
      
      {/* Visual fade at bottom (if no sources) */}
      {sources.length === 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-notion-bg to-transparent pointer-events-none opacity-80"></div>
      )}
    </div>
  );
};

export default NewsFeedBlock;