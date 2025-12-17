import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Mic, Calendar, Moon, Sun, LogOut, ChevronDown, Plus, X } from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavigate, isOpen, onClose }) => {
  const [isDark, setIsDark] = useState(true);

  // Initialize theme based on HTML class
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    if (newDarkState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: NavItem.Dashboard },
    { icon: TrendingUp, label: NavItem.CurrencyStrength },
    { icon: Mic, label: NavItem.CBSpeeches },
    { icon: Calendar, label: NavItem.WeeklyCalendar },
  ];

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-notion-sidebar/95 backdrop-blur-xl border-r border-notion-border h-full flex flex-col flex-shrink-0 text-notion-text transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand / Logo Section */}
        <div className="p-3 m-2 mb-4 group cursor-pointer flex justify-between items-start">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-notion-hover/50 border border-transparent hover:border-notion-border/50 transition-all duration-300 flex-1">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-blue-600 to-blue-700 rounded-lg text-white flex items-center justify-center shadow-lg shadow-blue-500/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-sm">
                      <path d="M12 2L2 22H22L12 2ZM12 7.5L17 17.5H7L12 7.5Z" fill="currentColor"/>
                  </svg>
              </div>
              
              <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1">
                      <span className="font-display font-bold text-base text-notion-text tracking-tight leading-none">AlphaLabs</span>
                  </div>
                  <span className="text-[9px] text-notion-muted font-mono uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity">Pro Terminal</span>
              </div>
              
              <ChevronDown size={14} className="text-notion-muted ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
          
          {/* Mobile/Tablet Close Button */}
          <button onClick={onClose} className="lg:hidden p-2 text-notion-muted hover:text-notion-text">
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          <div className="text-[10px] font-bold text-notion-muted px-3 py-2 mb-1 uppercase tracking-widest font-mono opacity-70">
            Trading Data
          </div>
          
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all group ${
                activeItem === item.label
                  ? 'bg-blue-600/10 text-blue-500 font-medium border border-blue-500/20'
                  : 'text-notion-muted hover:bg-notion-hover hover:text-notion-text border border-transparent'
              }`}
            >
              <item.icon size={16} className={activeItem === item.label ? "text-blue-500" : "group-hover:text-notion-text"} />
              <span className="font-display tracking-wide">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Footer / Theme Toggle */}
        <div className="p-3 border-t border-notion-border bg-notion-hover/10">
          <div 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm text-notion-muted hover:bg-notion-hover hover:text-notion-text transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="font-display">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm text-notion-muted hover:bg-notion-hover hover:text-red-400 transition-colors mt-1">
            <LogOut size={16} />
            <span className="font-display">Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;