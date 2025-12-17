import React from 'react';
import { Bell, CircleHelp, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
  onHelpClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, onHelpClick }) => {
  return (
    <div className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0 relative z-20">
      {/* Left Section: Menu & Breadcrumbs */}
      <div className="flex items-center gap-3 text-sm text-notion-muted font-display">
        {/* Mobile/Tablet Hamburger */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-notion-muted hover:text-notion-text hover:bg-notion-hover rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Mini Logo Icon */}
        <div className="hidden lg:flex w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-md text-white items-center justify-center shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22H22L12 2ZM12 7.5L17 17.5H7L12 7.5Z" fill="currentColor"/>
            </svg>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="hidden lg:block hover:text-notion-text cursor-pointer transition-colors tracking-wide font-medium">AlphaLabs</span>
            <span className="hidden lg:block opacity-30">/</span>
            <span className="text-notion-text font-medium cursor-default tracking-wide">Dashboard</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4 text-notion-muted">
         <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono bg-notion-hover/50 px-2 py-1 rounded border border-notion-border">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span>DATA LIVE</span>
         </div>
         <div className="hidden sm:block h-4 w-[1px] bg-notion-border"></div>
         <button className="hover:text-notion-text transition-colors relative hover:bg-notion-hover p-2 rounded-full">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
         </button>
         <button 
            onClick={onHelpClick}
            className="hidden sm:block hover:text-notion-text transition-colors hover:bg-notion-hover p-2 rounded-full"
         >
             <CircleHelp size={16} />
         </button>
      </div>
    </div>
  );
};

export default TopBar;