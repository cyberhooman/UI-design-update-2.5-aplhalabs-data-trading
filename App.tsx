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
import CurrencyStrengthView from './components/CurrencyStrengthView';
import CBSpeechAnalysisView from './components/CBSpeechAnalysisView';
import WeeklyCalendarView from './components/WeeklyCalendarView';
import { NavItem, NewsItem } from './types';
import { UPCOMING_EVENTS, MARKET_NEWS } from './constants';

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState<NavItem>(NavItem.Dashboard);
  const [newsItems, setNewsItems] = useState<NewsItem[]>(MARKET_NEWS);
  const [newsSources, setNewsSources] = useState<{ title: string; uri: string }[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const nextEvent = UPCOMING_EVENTS[0];

  const fetchLiveNews = async () => {
    if (isLoadingNews) return;
    setIsLoadingNews(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Find the top 8 absolute latest financial market news headlines using Google Search.
        Focus on Forex, Central Banks, and Geopolitics.
        Format: [URGENCY]|[TIME_AGO]|[HEADLINE_TEXT]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      const text = response.text || "";
      const lines = text.split('\n').filter(line => line.trim().length > 5);
      
      const newItems: NewsItem[] = lines.map((line, index) => {
        const parts = line.split('|');
        if (parts.length < 3) return { id: `l-${Date.now()}-${index}`, headline: line, timestamp: 'Live' };
        return {
          id: `l-${Date.now()}-${index}`,
          headline: parts[2].trim(),
          timestamp: parts[1].trim(),
          isUrgent: parts[0].includes('HIGH')
        };
      });

      if (newItems.length > 0) setNewsItems(newItems);

    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, []);

  const renderContent = () => {
    switch(activeNav) {
      case NavItem.CurrencyStrength:
        return <CurrencyStrengthView />;
      case NavItem.CBSpeeches:
        return <CBSpeechAnalysisView />;
      case NavItem.WeeklyCalendar:
        return <WeeklyCalendarView />;
      case NavItem.Dashboard:
      default:
        return (
          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-4 md:p-6 gap-5 custom-scrollbar">
            <div className="flex items-center justify-between shrink-0 mb-2 lg:mb-0">
               <div className="flex items-center gap-3 md:gap-4">
                   <h1 className="text-xl md:text-2xl font-display font-bold text-notion-text tracking-tight">Market Dashboard</h1>
                   <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-500 dark:text-blue-300 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">v2.5 PRO</span>
               </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:h-full">
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 h-auto lg:h-full min-h-0 order-1">
                  <div className="h-40 lg:flex-[4] shrink-0"><CountdownBlock event={nextEvent} /></div>
                  <div className="h-auto lg:flex-[6] min-h-0"><TradingPrepBlock /></div>
              </div>
              <div className="col-span-12 lg:col-span-6 h-[500px] lg:h-full min-h-0 order-3 lg:order-2">
                  <NewsFeedBlock news={newsItems} isLoading={isLoadingNews} onRefresh={fetchLiveNews} sources={newsSources} />
              </div>
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-5 h-auto lg:h-full min-h-0 order-2 lg:order-3">
                  <div className="h-64 lg:flex-[6] min-h-0"><EventsListBlock events={UPCOMING_EVENTS} /></div>
                  <div className="h-64 lg:flex-[4] min-h-0"><QuickNoteBlock /></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-notion-bg text-notion-text overflow-hidden selection:bg-blue-500/30 font-sans relative transition-colors duration-300">
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <Sidebar activeItem={activeNav} onNavigate={(item) => { setActiveNav(item); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full min-w-0 bg-transparent relative z-0">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} onHelpClick={() => setIsHelpOpen(true)} />
        {renderContent()}
      </div>
    </div>
  );
};

export default App;