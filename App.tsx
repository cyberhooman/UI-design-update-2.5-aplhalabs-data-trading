import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CountdownBlock from './components/CountdownBlock';
import EventsListBlock from './components/EventsListBlock';
import TradingPrepBlock from './components/TradingPrepBlock';
import QuickNoteBlock from './components/QuickNoteBlock';
import NewsFeedBlock from './components/NewsFeedBlock';
import HelpModal from './components/HelpModal';
import { NavItem, NewsItem } from './types';
import { UPCOMING_EVENTS, MARKET_NEWS } from './constants';

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItem>(NavItem.Dashboard);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(MARKET_NEWS);
  const [newsSources, setNewsSources] = useState<{ title: string; uri: string }[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // We find the next event to display in the big countdown
  const nextEvent = UPCOMING_EVENTS[0];

  const fetchLiveNews = async () => {
    if (isLoadingNews) return;
    setIsLoadingNews(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are a real-time financial news squawk box (like FinancialJuice). 
        Find the top 8 absolute latest, most critical financial market news headlines right now using Google Search.
        Focus on Forex, Central Banks (Fed, ECB, BOJ), Commodities (Gold, Oil), and Geopolitics.
        
        Strictly format your response as a list where each line follows this exact format:
        [URGENCY]|[TIME_AGO]|[HEADLINE_TEXT]
        
        [URGENCY]: Use HIGH for urgent, market-moving news (rates, war, breakouts). Use LOW for standard updates.
        [TIME_AGO]: Provide the specific time of the news event (e.g., "2m ago", "10:45 AM", "Just now").
        [HEADLINE_TEXT]: The news text. Keep it punchy and short.
        
        Example Output:
        HIGH|2m ago|Fed Chair Powell hints at further rate cuts in December
        LOW|15m ago|Gold futures dip slightly as dollar strengthens
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text || "";
      const lines = text.split('\n').filter(line => line.trim().length > 5);
      
      const newItems: NewsItem[] = lines.map((line, index) => {
        // We expect format: TAG|TIME|HEADLINE
        const parts = line.split('|');
        
        // Fallback if parsing fails (e.g. model output format deviation)
        if (parts.length < 3) {
             const headline = line.replace(/\[(HIGH|LOW)\]/gi, '').trim();
             return {
                id: `live-${Date.now()}-${index}`,
                headline: headline,
                timestamp: 'Live',
                isUrgent: line.toUpperCase().includes('HIGH')
             };
        }

        const urgencyTag = parts[0].trim().toUpperCase().replace(/[\[\]]/g, '');
        const timeStr = parts[1].trim().replace(/[\[\]]/g, '');
        const headline = parts.slice(2).join('|').trim().replace(/[\[\]]/g, ''); // Join rest in case headline has pipes
        
        return {
          id: `live-${Date.now()}-${index}`,
          headline: headline,
          timestamp: timeStr,
          isUrgent: urgencyTag.includes('HIGH')
        };
      });

      // Extract sources from grounding metadata
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .filter((c: any) => c.web?.uri && c.web?.title)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }))
        .slice(0, 5); // Take top 5 unique sources

      if (newItems.length > 0) {
        setNewsItems(newItems);
        setNewsSources(sources);
      }

    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Fetch news on mount
  useEffect(() => {
    fetchLiveNews();
  }, []);

  const renderContent = () => {
    switch(activeNav) {
      case NavItem.Dashboard:
      default:
        return (
          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6 gap-5 custom-scrollbar">
            
            {/* Dashboard Header */}
            <div className="flex items-center justify-between shrink-0 mb-2 lg:mb-0">
               <div className="flex items-center gap-3 md:gap-4">
                   <h1 className="text-xl md:text-2xl font-display font-bold text-notion-text tracking-tight">Market Dashboard</h1>
                   <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-500 dark:text-blue-300 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">v2.5 PRO</span>
               </div>
               <div className="flex items-center gap-4 text-xs font-mono text-notion-muted">
                  <span className="hidden sm:flex items-center gap-2 px-3 py-1 bg-notion-block/50 rounded-full border border-notion-border backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    SYSTEM LIVE
                  </span>
               </div>
            </div>

            {/* Responsive Layout: Stacked on Mobile/Tablet (<1024px), Grid on Desktop (>=1024px) */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:h-full">
              
              {/* Column 1: Strategy & Focus (25%) */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 h-auto lg:h-full min-h-0 order-1">
                  <div className="h-40 lg:flex-[4] shrink-0">
                     <CountdownBlock event={nextEvent} />
                  </div>
                  <div className="h-auto lg:flex-[6] min-h-0">
                     <TradingPrepBlock />
                  </div>
              </div>

              {/* Column 2: The Pulse / News (50%) */}
              <div className="col-span-12 lg:col-span-6 h-[500px] lg:h-full min-h-0 order-3 lg:order-2">
                  <NewsFeedBlock 
                    news={newsItems} 
                    isLoading={isLoadingNews} 
                    onRefresh={fetchLiveNews}
                    sources={newsSources}
                  />
              </div>

              {/* Column 3: Logistics (25%) */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 h-auto lg:h-full min-h-0 order-2 lg:order-3">
                  <div className="h-64 lg:flex-[6] min-h-0">
                     <EventsListBlock events={UPCOMING_EVENTS} />
                  </div>
                  <div className="h-64 lg:flex-[4] min-h-0">
                     <QuickNoteBlock />
                  </div>
              </div>
              
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-notion-bg text-notion-text overflow-hidden selection:bg-blue-500/30 font-sans relative transition-colors duration-300">
      
      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Ambient Background Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300/30 dark:bg-blue-900/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
          <div className="absolute top-[20%] right-[30%] w-[30%] h-[30%] bg-teal-300/30 dark:bg-teal-900/10 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
      </div>

      <Sidebar 
        activeItem={activeNav} 
        onNavigate={(item) => { setActiveNav(item); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col h-full min-w-0 bg-transparent relative z-0">
        <TopBar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onHelpClick={() => setIsHelpOpen(true)}
        />
        
        {/* Main Content Area (Dynamic) */}
        {renderContent()}
      </div>
    </div>
  );
};

export default App;