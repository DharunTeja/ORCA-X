import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, PageId } from './components/Sidebar';
import { AgentChatModal } from './components/AgentChatModal';
import { DashboardPage } from './pages/DashboardPage';
import { MarineIntelligencePage } from './pages/MarineIntelligencePage';
import { RiskAssessmentPage } from './pages/RiskAssessmentPage';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { KnowledgeCenterPage } from './pages/KnowledgeCenterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LanguageCode } from './types';
import { MessageSquare, Sparkles } from 'lucide-react';

export function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{ lat: number; lon: number } | null>(null);

  const handleCoordinateSelect = (lat: number, lon: number) => {
    setSelectedCoord({ lat, lon });
    setActivePage('risk');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            currentLang={currentLang}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            onSelectCoordinate={handleCoordinateSelect}
          />
        );
      case 'marine':
        return (
          <MarineIntelligencePage
            currentLang={currentLang}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        );
      case 'risk':
        return (
          <RiskAssessmentPage
            currentLang={currentLang}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            selectedCoordinate={selectedCoord}
          />
        );
      case 'routes':
        return (
          <RoutePlannerPage
            currentLang={currentLang}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        );
      case 'explain':
        return (
          <ExplainabilityPage
            currentLang={currentLang}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeCenterPage
            currentLang={currentLang}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        );
      case 'admin':
        return (
          <AdminDashboardPage
            currentLang={currentLang}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        );
      default:
        return (
          <DashboardPage
            currentLang={currentLang}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Government Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        activeAlertCount={4}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          onSelectPage={setActivePage}
          currentLang={currentLang}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {renderActivePage()}
        </main>
      </div>

      {/* Floating AI Copilot Trigger */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center space-x-2.5 transition-all hover:scale-105 group"
      >
        <Sparkles className="w-5 h-5 text-sky-200 animate-pulse" />
        <span className="text-xs font-semibold pr-1 hidden sm:inline">
          ORCA-X Multi-Agent Copilot
        </span>
      </button>

      {/* Interactive Multi-Agent Chat Modal */}
      <AgentChatModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}

export default App;
