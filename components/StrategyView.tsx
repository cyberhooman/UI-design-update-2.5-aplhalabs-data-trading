import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Plus, Sparkles, Trash2, Save, FileText, ChevronRight, Check, XCircle } from 'lucide-react';
import { Strategy } from '../types';

const StrategyView: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>(() => {
    try {
      const saved = localStorage.getItem('alphalabs_strategies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form States for Active Strategy
  const activeStrategy = strategies.find(s => s.id === activeStrategyId);
  
  useEffect(() => {
    localStorage.setItem('alphalabs_strategies', JSON.stringify(strategies));
  }, [strategies]);

  const createNewStrategy = () => {
    const newStrategy: Strategy = {
      id: Date.now().toString(),
      pair: 'EURUSD',
      direction: 'Neutral',
      status: 'Draft',
      thesis: '',
      timeframe: 'H4',
      lastUpdated: new Date().toISOString()
    };
    setStrategies([newStrategy, ...strategies]);
    setActiveStrategyId(newStrategy.id);
  };

  const updateActiveStrategy = (updates: Partial<Strategy>) => {
    if (!activeStrategyId) return;
    setStrategies(prev => prev.map(s => s.id === activeStrategyId ? { ...s, ...updates, lastUpdated: new Date().toISOString() } : s));
  };

  const analyzeWithAI = async () => {
    if (!activeStrategy || !activeStrategy.thesis) return;
    setIsAnalyzing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a senior institutional trader at a major hedge fund (e.g., Bridgewater, Citadel).
        Review the following trading thesis for a ${activeStrategy.direction} on ${activeStrategy.pair} (${activeStrategy.timeframe}).
        
        Thesis: "${activeStrategy.thesis}"
        
        Provide a concise, brutal, and professional critique. 
        1. Identify logic gaps.
        2. Point out missing confluence (e.g., did they mention macro? volume? market structure?).
        3. Rate the conviction (1-10).
        
        Keep it under 150 words. Use bullet points.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      updateActiveStrategy({ aiFeedback: response.text });
    } catch (e) {
      console.error(e);
      updateActiveStrategy({ aiFeedback: "Error connecting to AI Audit." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold font-display text-notion-text">Strategies</h2>
                <button 
                    onClick={createNewStrategy}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all"
                >
                    <Plus size={18} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {strategies.length === 0 && (
                    <div className="text-center py-10 opacity-40">
                        <FileText size={32} className="mx-auto mb-2" />
                        <p className="text-sm">No strategies drafted.</p>
                    </div>
                )}
                {strategies.map(strategy => (
                    <div 
                        key={strategy.id}
                        onClick={() => setActiveStrategyId(strategy.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all group relative ${
                            activeStrategyId === strategy.id 
                            ? 'bg-blue-500/5 border-blue-500/50 shadow-md' 
                            : 'bg-notion-block/50 border-notion-border hover:border-notion-muted/50'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                             <span className="font-mono font-bold text-sm">{strategy.pair}</span>
                             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                                 strategy.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                 strategy.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                 'bg-notion-muted/20 text-notion-muted'
                             }`}>{strategy.status}</span>
                        </div>
                        <div className="text-xs text-notion-muted line-clamp-2 font-display mb-2 min-h-[1.5em]">
                            {strategy.thesis || "No thesis drafted..."}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-notion-muted opacity-60">
                             <span>{strategy.timeframe}</span>
                             <span>{new Date(strategy.lastUpdated).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 h-full bg-notion-block border border-notion-border rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            {activeStrategy ? (
                <>
                    {/* Editor Toolbar */}
                    <div className="p-4 border-b border-notion-border flex flex-wrap items-center justify-between gap-4 bg-notion-sidebar/30">
                        <div className="flex items-center gap-4">
                            <input 
                                value={activeStrategy.pair}
                                onChange={(e) => updateActiveStrategy({ pair: e.target.value.toUpperCase() })}
                                className="bg-transparent text-2xl font-bold font-mono w-32 focus:outline-none placeholder-notion-muted/30"
                                placeholder="PAIR"
                            />
                            <div className="h-6 w-[1px] bg-notion-border"></div>
                            <select 
                                value={activeStrategy.direction}
                                onChange={(e) => updateActiveStrategy({ direction: e.target.value as any })}
                                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                            >
                                <option value="Neutral">Neutral</option>
                                <option value="Long">Long ↗</option>
                                <option value="Short">Short ↘</option>
                            </select>
                            <select 
                                value={activeStrategy.timeframe}
                                onChange={(e) => updateActiveStrategy({ timeframe: e.target.value })}
                                className="bg-transparent text-sm font-mono text-notion-muted focus:outline-none cursor-pointer"
                            >
                                <option>M15</option>
                                <option>H1</option>
                                <option>H4</option>
                                <option>D1</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                             <select 
                                value={activeStrategy.status}
                                onChange={(e) => updateActiveStrategy({ status: e.target.value as any })}
                                className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-md border focus:outline-none cursor-pointer appearance-none text-center ${
                                    activeStrategy.status === 'Active' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                                    activeStrategy.status === 'Pending' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
                                    'bg-notion-hover border-notion-border text-notion-muted'
                                }`}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Closed">Closed</option>
                            </select>
                             <button 
                                onClick={() => {
                                    setStrategies(strategies.filter(s => s.id !== activeStrategyId));
                                    setActiveStrategyId(null);
                                }}
                                className="p-2 text-notion-muted hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                            >
                                <Trash2 size={16} />
                             </button>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Text Area */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <label className="block text-xs font-bold text-notion-muted uppercase tracking-wider mb-3">Investment Thesis & Technicals</label>
                            <textarea 
                                value={activeStrategy.thesis}
                                onChange={(e) => updateActiveStrategy({ thesis: e.target.value })}
                                className="w-full h-[calc(100%-2rem)] bg-transparent resize-none focus:outline-none text-notion-text leading-relaxed font-serif text-lg placeholder-notion-muted/20"
                                placeholder="Describe the setup. What is the macro narrative? Where are the liquidity sweeps? What is the invalidation level?"
                            />
                        </div>

                        {/* AI Audit Panel */}
                        <div className="w-full md:w-80 border-l border-notion-border bg-notion-sidebar/50 p-5 flex flex-col">
                            <div className="mb-6">
                                <button 
                                    onClick={analyzeWithAI}
                                    disabled={isAnalyzing || !activeStrategy.thesis}
                                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-lg transition-all ${
                                        isAnalyzing 
                                        ? 'bg-notion-muted cursor-wait opacity-70' 
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-500 text-white hover:scale-[1.02]'
                                    }`}
                                >
                                    {isAnalyzing ? <Sparkles className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                    {isAnalyzing ? 'Auditing...' : 'AI Audit Strategy'}
                                </button>
                                <p className="text-[10px] text-notion-muted mt-2 text-center opacity-70">
                                    Uses Gemini 2.5 Flash to critique logic holes.
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {activeStrategy.aiFeedback ? (
                                    <div className="prose prose-invert prose-sm">
                                        <h4 className="text-xs font-bold text-notion-muted uppercase mb-2">Audit Report</h4>
                                        <div className="text-sm leading-relaxed text-notion-text/90 whitespace-pre-wrap font-mono p-3 bg-notion-bg rounded border border-notion-border">
                                            {activeStrategy.aiFeedback}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-notion-muted/40 border-2 border-dashed border-notion-border rounded-xl">
                                        <ShieldAlert className="mb-2" size={24} />
                                        <span className="text-xs font-medium">No audit run yet</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-notion-muted opacity-50">
                    <FileText size={48} className="mb-4" />
                    <p className="font-display text-lg">Select a strategy or create a new one</p>
                </div>
            )}
        </div>
    </div>
  );
};

// Import needed for icon usage in loop above if extracted, but defined in same file here
import { ShieldAlert } from 'lucide-react';

export default StrategyView;