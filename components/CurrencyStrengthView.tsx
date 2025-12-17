import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RefreshCw, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Minus, Timer } from 'lucide-react';

interface CurrencyData {
  rank: number;
  symbol: string;
  score: number;
  change7d: string;
  momentum: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
}

const INITIAL_DATA: CurrencyData[] = [
  { rank: 1, symbol: 'CHF', score: 100.00, change7d: '+0.77%', momentum: 'STRONG BUY' },
  { rank: 2, symbol: 'EUR', score: 80.79, change7d: '+0.47%', momentum: 'STRONG BUY' },
  { rank: 3, symbol: 'JPY', score: 78.10, change7d: '+0.43%', momentum: 'BUY' },
  { rank: 4, symbol: 'CAD', score: 54.81, change7d: '+0.07%', momentum: 'NEUTRAL' },
  { rank: 5, symbol: 'GBP', score: 43.27, change7d: '-0.10%', momentum: 'NEUTRAL' },
  { rank: 6, symbol: 'USD', score: 24.63, change7d: '-0.39%', momentum: 'SELL' },
  { rank: 7, symbol: 'NZD', score: 18.61, change7d: '-0.48%', momentum: 'STRONG SELL' },
  { rank: 8, symbol: 'AUD', score: 0.00, change7d: '-0.76%', momentum: 'STRONG SELL' },
];

const CurrencyStrengthView: React.FC = () => {
  const [currencies, setCurrencies] = useState<CurrencyData[]>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  const fetchStrength = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        You are a professional forex analyst. 
        Search for real-time market sentiment and relative strength for the 8 major currencies (USD, EUR, GBP, JPY, AUD, CAD, NZD, CHF).
        
        Provide the output in a clean JSON array format.
        Each object should have:
        - "symbol": Currency code (e.g., "USD")
        - "score": A float from 0 to 100 representing current strength relative to the others.
        - "change7d": A string representing the 7-day percentage change (e.g., "+0.45%").
        - "momentum": One of "STRONG BUY", "BUY", "NEUTRAL", "SELL", "STRONG SELL".
        
        Rank them from strongest (score near 100) to weakest (score near 0).
        Return ONLY the raw JSON array. No markdown, no commentary.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // Fixed: Removed responseMimeType and responseSchema because they are unsupported when using googleSearch tool
        }
      });

      const text = response.text || "[]";
      // Sanitize JSON output (in case model wraps it in ```json)
      const cleanedJson = text.replace(/```json|```/gi, '').trim();
      const rawData = JSON.parse(cleanedJson);
      
      if (Array.isArray(rawData)) {
        const mappedData: CurrencyData[] = rawData.map((item, index) => ({
          rank: index + 1,
          symbol: item.symbol,
          score: parseFloat(item.score),
          change7d: item.change7d,
          momentum: item.momentum as any
        }));
        setCurrencies(mappedData);
        setLastUpdated(new Date().toLocaleTimeString());
      }

    } catch (error) {
      console.error("Failed to fetch currency strength", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMomentumStyles = (momentum: string) => {
    switch (momentum) {
      case 'STRONG BUY': return 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20';
      case 'BUY': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
      case 'SELL': return 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20';
      case 'STRONG SELL': return 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20';
      default: return 'bg-notion-hover text-notion-muted border-notion-border hover:bg-notion-border';
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden bg-notion-bg">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
         <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5">
                 <Activity className="text-blue-500" size={24} />
             </div>
             <div>
                 <h1 className="text-3xl font-display font-bold text-notion-text tracking-tight">Currency Strength Analysis</h1>
                 <p className="text-xs text-notion-muted font-mono mt-1 flex items-center gap-2">
                     <Timer size={12} />
                     Real-time Market Matrix • Institutional Grade
                 </p>
             </div>
         </div>
         <div className="flex flex-col items-end gap-2">
            <button 
                onClick={fetchStrength}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#252b3d] hover:bg-[#2d354a] border border-[#343b50] rounded-lg text-sm font-bold transition-all text-white disabled:opacity-50 shadow-lg active:scale-95"
            >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                {isLoading ? 'ANALYZING...' : 'Refresh'}
            </button>
            <span className="text-[10px] text-notion-muted font-mono uppercase tracking-widest">
                Updated: {lastUpdated}
            </span>
         </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-4">
        
        {/* Table Header Row */}
        <div className="grid grid-cols-12 px-6 py-4 bg-[#1a202e] border border-notion-border rounded-xl mb-2 text-[11px] font-bold text-notion-muted tracking-widest uppercase">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3 text-center">Currency</div>
            <div className="col-span-3 text-center">Strength</div>
            <div className="col-span-3 text-center">7-Day Change</div>
            <div className="col-span-2 text-right">Momentum</div>
        </div>

        {/* Currency Rows */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-8">
            {currencies.map((currency) => (
                <div 
                    key={currency.symbol} 
                    className="grid grid-cols-12 items-center px-6 py-5 bg-[#141925] border border-notion-border rounded-xl hover:border-notion-muted/30 hover:bg-[#1a202e] transition-all group shadow-sm"
                >
                    {/* Rank */}
                    <div className="col-span-1">
                        <span className="font-mono text-sm text-notion-muted">#{currency.rank}</span>
                    </div>

                    {/* Currency Symbol */}
                    <div className="col-span-3 text-center">
                        <span className="text-xl font-display font-bold text-notion-text tracking-widest group-hover:text-blue-400 transition-colors">
                            {currency.symbol}
                        </span>
                    </div>

                    {/* Strength Score */}
                    <div className="col-span-3 text-center">
                        <span className="text-lg font-mono font-bold text-blue-500">
                            {currency.score.toFixed(2)}
                        </span>
                    </div>

                    {/* 7-Day Change */}
                    <div className="col-span-3 text-center">
                        <span className={`font-mono font-bold text-sm ${currency.change7d.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {currency.change7d}
                        </span>
                    </div>

                    {/* Momentum Button */}
                    <div className="col-span-2 text-right">
                        <button className={`px-4 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${getMomentumStyles(currency.momentum)}`}>
                            {currency.momentum}
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Analytics Footer */}
      <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                 <TrendingUp size={16} className="text-blue-500" />
             </div>
             <p className="text-xs text-notion-text/80 leading-relaxed font-medium">
                <span className="text-blue-400 font-bold uppercase mr-2">Top Performer:</span>
                {currencies[0]?.symbol} shows highest relative momentum. Historical bias favors {currencies[0]?.symbol} crosses for long duration entries.
             </p>
         </div>
         <div className="hidden lg:flex items-center gap-6">
            <div className="text-right">
                <span className="block text-[9px] text-notion-muted uppercase font-bold tracking-tighter">Volatility Index</span>
                <span className="text-sm font-mono font-bold text-green-500">LOW</span>
            </div>
            <div className="text-right">
                <span className="block text-[9px] text-notion-muted uppercase font-bold tracking-tighter">Market Bias</span>
                <span className="text-sm font-mono font-bold text-blue-400">RISK-ON</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CurrencyStrengthView;