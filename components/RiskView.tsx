import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle, TrendingUp, DollarSign, Percent } from 'lucide-react';

const RiskView: React.FC = () => {
  // Persisted Settings
  const [balance, setBalance] = useState<number>(() => {
    const s = localStorage.getItem('alphalabs_balance');
    return s ? parseFloat(s) : 10000;
  });
  
  // Calculator State
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [stopLossPips, setStopLossPips] = useState<number>(20);
  const [pair, setPair] = useState<string>('EURUSD');
  const [pipValue, setPipValue] = useState<number>(10); // Standard lot pip value approx

  useEffect(() => {
    localStorage.setItem('alphalabs_balance', balance.toString());
  }, [balance]);

  // Calculations
  const riskAmount = (balance * riskPercent) / 100;
  const positionSizeStandardLots = riskAmount / (stopLossPips * pipValue);
  const positionSizeUnits = positionSizeStandardLots * 100000;
  
  // Risk Health Check
  const isHighRisk = riskPercent > 2.0;
  const isExtremeRisk = riskPercent > 5.0;

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
        <h1 className="text-2xl font-display font-bold text-notion-text mb-6 flex items-center gap-3">
            <Calculator className="text-blue-500" /> Risk Management Cockpit
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Account Configuration (Left Panel) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-notion-block border border-notion-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-notion-muted uppercase tracking-wider mb-4">Account Settings</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-notion-muted mb-1">Account Balance ($)</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-notion-muted" />
                                <input 
                                    type="number" 
                                    value={balance}
                                    onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                                    className="w-full bg-notion-hover/50 border border-notion-border rounded-lg py-3 pl-9 pr-4 text-lg font-mono font-bold focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Warning Card */}
                <div className={`rounded-xl p-6 border transition-colors ${
                    isExtremeRisk ? 'bg-red-500/10 border-red-500/30' : 
                    isHighRisk ? 'bg-yellow-500/10 border-yellow-500/30' : 
                    'bg-green-500/10 border-green-500/30'
                }`}>
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle size={20} className={isExtremeRisk ? 'text-red-500' : isHighRisk ? 'text-yellow-500' : 'text-green-500'} />
                        <h3 className={`font-bold ${isExtremeRisk ? 'text-red-500' : isHighRisk ? 'text-yellow-500' : 'text-green-500'}`}>
                            {isExtremeRisk ? 'EXTREME RISK' : isHighRisk ? 'ELEVATED RISK' : 'SAFE ZONE'}
                        </h3>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">
                        {isExtremeRisk 
                            ? "You are risking over 5% of your equity on a single trade. This is professional suicide. Reduce size immediately." 
                            : isHighRisk 
                            ? "Risking between 2-5% is aggressive. Ensure your win rate supports this drawdown potential." 
                            : "Standard professional risk (≤ 2%). This ensures longevity and handles losing streaks."}
                    </p>
                </div>
            </div>

            {/* 2. Calculator (Center/Right Panel) */}
            <div className="col-span-12 lg:col-span-8 bg-notion-overlay backdrop-blur-xl border border-notion-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Calculator size={120} />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="flex items-center justify-between text-sm font-medium text-notion-text mb-2">
                                <span>Risk Percentage</span>
                                <span className={`font-mono text-xs px-2 py-0.5 rounded ${isHighRisk ? 'bg-red-500 text-white' : 'bg-notion-muted/20'}`}>{riskPercent}%</span>
                            </label>
                            <input 
                                type="range" 
                                min="0.1" 
                                max="10" 
                                step="0.1"
                                value={riskPercent}
                                onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
                                className="w-full h-2 bg-notion-border rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-[10px] text-notion-muted mt-1 font-mono">
                                <span>0.1%</span>
                                <span>2.0% (Rec)</span>
                                <span>10%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-notion-muted mb-1">Stop Loss (Pips)</label>
                                <input 
                                    type="number" 
                                    value={stopLossPips}
                                    onChange={(e) => setStopLossPips(parseFloat(e.target.value) || 1)}
                                    className="w-full bg-notion-bg border border-notion-border rounded-lg p-3 font-mono text-notion-text focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-notion-muted mb-1">Asset Class</label>
                                <select 
                                    value={pair}
                                    onChange={(e) => {
                                        setPair(e.target.value);
                                        // Simple logical switch for pip value approximation
                                        if (e.target.value === 'XAUUSD') setPipValue(1); // $1 per pip per 1 lot approx (simplified)
                                        else if (e.target.value.includes('JPY')) setPipValue(7);
                                        else setPipValue(10);
                                    }}
                                    className="w-full bg-notion-bg border border-notion-border rounded-lg p-3 font-mono text-notion-text focus:outline-none focus:border-blue-500"
                                >
                                    <option value="EURUSD">Forex Major (EUR/USD)</option>
                                    <option value="USDJPY">Forex JPY (USD/JPY)</option>
                                    <option value="XAUUSD">Gold (XAU/USD)</option>
                                    <option value="BTCUSD">Bitcoin (BTC/USD)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-notion-block/50 border border-notion-border rounded-xl p-6 flex flex-col justify-center gap-6">
                        <div className="text-center">
                            <span className="text-xs font-bold text-notion-muted uppercase tracking-wider">Position Size (Lots)</span>
                            <div className="text-5xl font-bold font-mono text-blue-500 mt-2 tracking-tight">
                                {positionSizeStandardLots.toFixed(2)}
                            </div>
                            <div className="text-xs text-notion-muted mt-1 font-mono opacity-60">
                                {Math.round(positionSizeUnits).toLocaleString()} units
                            </div>
                        </div>

                        <div className="h-px w-full bg-notion-border"></div>

                        <div className="flex justify-between items-center px-4">
                             <div>
                                 <span className="block text-[10px] text-notion-muted uppercase">Amount at Risk</span>
                                 <span className="text-xl font-bold text-red-500 font-mono">-${riskAmount.toFixed(2)}</span>
                             </div>
                             <div className="text-right">
                                 <span className="block text-[10px] text-notion-muted uppercase">Potential Reward (1:3)</span>
                                 <span className="text-xl font-bold text-green-500 font-mono">+${(riskAmount * 3).toFixed(2)}</span>
                             </div>
                        </div>
                    </div>
                 </div>

                 {/* Visual Bar */}
                 <div className="mt-8">
                    <div className="flex justify-between text-xs font-medium mb-2">
                        <span>Risk Viz</span>
                        <span>{riskPercent}% of Equity</span>
                    </div>
                    <div className="h-4 w-full bg-notion-border rounded-full overflow-hidden flex">
                        <div 
                            className={`h-full transition-all duration-500 ${isHighRisk ? 'bg-red-500' : 'bg-blue-500'}`} 
                            style={{ width: `${Math.min(riskPercent * 10, 100)}%` }} // Scaled for visibility
                        ></div>
                    </div>
                    <p className="text-[10px] text-notion-muted mt-2 text-center">
                        Bar represents risk scale relative to max recommended limit (10%).
                    </p>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default RiskView;