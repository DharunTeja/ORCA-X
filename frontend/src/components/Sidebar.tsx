import React from 'react';
import {
  LayoutDashboard,
  Waves,
  ShieldAlert,
  Navigation,
  HelpCircle,
  BookOpen,
  Settings,
  ChevronRight,
  Fish,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../lib/translations';

export type PageId =
  | 'dashboard'
  | 'marine'
  | 'risk'
  | 'routes'
  | 'explain'
  | 'knowledge'
  | 'admin';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  currentLang: LanguageCode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  currentLang,
}) => {
  const t = UI_TRANSLATIONS[currentLang];

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'marine',
      label: t.navMarine,
      icon: <Waves className="w-4 h-4" />,
      badge: 'INCOIS PFZ',
    },
    {
      id: 'risk',
      label: t.navRisk,
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: 'Live',
    },
    {
      id: 'routes',
      label: t.navRoutes,
      icon: <Navigation className="w-4 h-4" />,
    },
    {
      id: 'explain',
      label: t.navExplain,
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      id: 'knowledge',
      label: t.navKnowledge,
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'admin',
      label: t.navAdmin,
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-[calc(100vh-6rem)] sticky top-[6rem]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Core Operations
        </div>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-50 text-sky-900 font-semibold shadow-subtle border border-sky-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-sky-600' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                    isActive
                      ? 'bg-sky-200 text-sky-900'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Coastal Telemetry Summary Box */}
      <div className="p-3 border-t border-gray-200">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Fish className="w-3.5 h-3.5 text-sky-600" />
              North Indian Ocean
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Multi-satellite SST & Chlorophyll composite active across Bay of Bengal & Arabian Sea.
          </p>
        </div>
      </div>
    </aside>
  );
};
