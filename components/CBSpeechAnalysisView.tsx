import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RefreshCw, Search, ExternalLink, Sparkles, Filter, ChevronDown, Mic } from 'lucide-react';
import { CBSpeech } from '../types';
import { MOCK_CB_SPEECHES } from '../constants';

const CBSpeechAnalysisView: React.FC = () => {
  const [speeches, setSpeeches] = useState<CBSpeech[]>(MOCK_CB_SPEECHES);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const fetchLatestSpeeches = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Search for the 10 absolute latest Central Bank speeches or official comments from the Fed, ECB, BoJ, BoE, and RBA.
        Provide a list. For each item include:
        - Date
        - Currency (USD, EUR, JPY, GBP, AUD)
        - Speaker name/title
        - A one-sentence summary of the main point.
        Format your response as a JSON array.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      const text = response.text || "[]";
      const cleanedJson = text.replace(/```json|```/gi, '').trim();
      const rawData = JSON.parse(cleanedJson);

      if (Array.isArray(rawData)) {
        const newSpeeches: CBSpeech[] = rawData.map((item, idx) => ({
          id: `live-cb-${idx}-${Date.now()}`,
          currency: item.currency || 'USD',
          date: item.date || new Date().toISOString().split('T')[0],
          speaker: item.speaker || 'Official',
          content: item.content || item.summary || '',
          sourceUrl: '#'
        }));
        setSpeeches(newSpeeches);
      }
    } catch (error) {
      console.error("Failed to fetch CB speeches", error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSpeech = async (speech: CBSpeech) => {
    setAnalyzingId(speech.id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analyze this Central Bank comment for sentiment/bias: "${speech.content}"
        Is it HAWKISH (leaning towards higher rates/tightening), DOVISH (leaning towards lower rates/easing), or NEUTRAL?
        Provide a numerical score from 0 to 100 for the intensity.
        Return ONLY a JSON object: {"label": "HAWKISH" | "DOVISH" | "NEUTRAL", "score": number}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || "{}";
      const bias = JSON.parse(text.replace(/```json|```/gi, '').trim());
      
      setSpeeches(prev => prev.map(s => s.id === speech.id ? { ...s, bias } : s));
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setAnalyzingId(null);
    }
  };

  const getCurrencyColor = (ccy: string) => {
    switch (ccy) {
      case 'USD': return 'bg-blue-600';
      case 'EUR': return 'bg-indigo-600';
      case 'JPY': return 'bg-purple-600';
      case 'GBP': return 'bg-teal-600';
      case 'AUD': return 'bg-blue-800';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-[#0B0E14] overflow-hidden">
      
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between mb-6 shrink-0 bg-[#161B22] p-3 rounded-xl border border-[#30363D]">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            CB Speech Analysis <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30">FJ</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select className="bg-[#0D1117] text-gray-300 text-xs py-2 pl-3 pr-8 rounded-lg border border-[#30363D] appearance-none focus:outline-none focus:border-blue-500 cursor-pointer">
              <option>All Types</option>
              <option>Speeches</option>
              <option>Interviews</option>
              <option>Reports</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          
          <div className="relative group">
            <select className="bg-[#0D1117] text-gray-300 text-xs py-2 pl-3 pr-8 rounded-lg border border-[#30363D] appearance-none focus:outline-none focus:border-blue-500 cursor-pointer">
              <option>All Banks</option>
              <option>Federal Reserve</option>
              <option>ECB</option>
              <option>BoJ</option>
              <option>BoE</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <button 
            onClick={fetchLatestSpeeches}
            disabled={isLoading}
            className="bg-[#00D395] hover:bg-[#00BB84] text-[#0D1117] font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? <RefreshCw size={14} className="animate-spin" /> : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-8">
        {speeches.map((speech) => (
          <div 
            key={speech.id} 
            className="bg-[#161B22]/80 border border-[#30363D] rounded-xl p-4 hover:bg-[#1C2128] transition-all group relative"
          >
            <div className="flex items-start gap-4">
              {/* CCY Badge */}
              <div className={`${getCurrencyColor(speech.currency)} text-white text-[10px] font-bold px-2 py-0.5 rounded shrink-0 shadow-sm`}>
                {speech.currency}
              </div>
              
              {/* Meta Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gray-500 text-[11px] font-mono">{speech.date}</span>
                  <span className="text-gray-400 text-[11px] font-medium">{speech.speaker}</span>
                </div>
                
                {/* Content */}
                <p className="text-gray-200 text-sm leading-relaxed font-sans mb-3">
                  {speech.content}
                </p>
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-4 shrink-0">
                {speech.bias ? (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wider ${
                    speech.bias.label === 'HAWKISH' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    speech.bias.label === 'DOVISH' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-gray-500/10 text-gray-500 border-gray-500/20'
                  }`}>
                    {speech.bias.label} (+{speech.bias.score})
                  </div>
                ) : (
                  <button 
                    onClick={() => analyzeSpeech(speech)}
                    disabled={analyzingId === speech.id}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {analyzingId === speech.id ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Analyze
                  </button>
                )}
                
                <a href={speech.sourceUrl} className="text-gray-500 hover:text-gray-300 text-[11px] transition-colors">
                  Source
                </a>
              </div>
            </div>
          </div>
        ))}
        
        {speeches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
             <Mic size={48} className="mb-4 opacity-20" />
             <p className="text-sm font-medium">No Central Bank speeches found.</p>
             <button onClick={fetchLatestSpeeches} className="mt-4 text-blue-500 hover:underline text-xs">Refresh Feed</button>
          </div>
        )}
      </div>

      {/* Institutional Disclaimer */}
      <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600 font-mono uppercase tracking-widest border-t border-[#30363D] pt-4 shrink-0">
         <span>Institutional Feed Active</span>
         <div className="flex gap-4">
            <span>Aggregators: Bloomberg, Reuters, FJ</span>
            <span>Latency: 2ms</span>
         </div>
      </div>
    </div>
  );
};

export default CBSpeechAnalysisView;