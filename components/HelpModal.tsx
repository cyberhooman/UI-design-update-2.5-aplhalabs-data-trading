import React from 'react';
import { X, Keyboard, Zap, Globe, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-notion-block border border-notion-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-notion-border flex items-center justify-between bg-notion-bg/50">
          <h2 className="text-lg font-display font-bold text-notion-text">Help & Documentation</h2>
          <button 
            onClick={onClose}
            className="text-notion-muted hover:text-notion-text transition-colors p-1 hover:bg-notion-hover rounded"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-notion-muted uppercase tracking-wider flex items-center gap-2">
              <Zap size={14} /> Platform Overview
            </h3>
            <p className="text-sm text-notion-text leading-relaxed opacity-90">
              AlphaLabs is a professional data trading dashboard designed for institutional-grade speed and clarity. 
              It aggregates real-time news, economic events, and provides AI-driven analysis for trading setups.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-3 rounded-lg border border-notion-border bg-notion-hover/30">
                <div className="flex items-center gap-2 mb-2 text-blue-500">
                   <Globe size={16} />
                   <span className="font-bold text-xs">Live Feed</span>
                </div>
                <p className="text-[11px] text-notion-muted">
                   Real-time financial squawk box powered by Gemini 2.5 Flash & Google Search grounding.
                </p>
             </div>
             <div className="p-3 rounded-lg border border-notion-border bg-notion-hover/30">
                <div className="flex items-center gap-2 mb-2 text-green-500">
                   <ShieldCheck size={16} />
                   <span className="font-bold text-xs">Data Integrity</span>
                </div>
                <p className="text-[11px] text-notion-muted">
                   Economic events are synced automatically. Countdown timer adjusts to local system time.
                </p>
             </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-sm font-bold text-notion-muted uppercase tracking-wider flex items-center gap-2">
              <Keyboard size={14} /> Shortcuts
            </h3>
            <div className="space-y-2">
               <div className="flex items-center justify-between text-xs p-2 rounded hover:bg-notion-hover transition-colors">
                  <span className="text-notion-text">Quick Note Entry</span>
                  <span className="font-mono text-notion-muted bg-notion-border px-1.5 py-0.5 rounded">Enter</span>
               </div>
               <div className="flex items-center justify-between text-xs p-2 rounded hover:bg-notion-hover transition-colors">
                  <span className="text-notion-text">Toggle Theme</span>
                  <span className="font-mono text-notion-muted bg-notion-border px-1.5 py-0.5 rounded">Sidebar</span>
               </div>
            </div>
          </div>

        </div>
        
        <div className="px-6 py-4 bg-notion-hover/30 border-t border-notion-border text-center">
           <p className="text-[10px] text-notion-muted font-mono">
              Version 2.5.0 (Pro Build) • © 2024 AlphaLabs
           </p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;