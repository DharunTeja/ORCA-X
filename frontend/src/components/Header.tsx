import React, { useState, useEffect } from 'react';
import {
  Compass,
  Globe,
  Radio,
  Bell,
  Cpu,
  ShieldCheck,
  ChevronDown,
  Volume2,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES, UI_TRANSLATIONS } from '../lib/translations';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenCopilot: () => void;
  activeAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenCopilot,
  activeAlertCount,
}) => {
  const t = UI_TRANSLATIONS[currentLang];
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-subtle">
      {/* Top Ministry Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            INCOIS / MoES
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">{t.governmentBadge}</span>
        </div>
        <div className="flex items-center space-x-4 text-slate-300 font-mono text-[11px]">
          <span className="text-sky-400 flex items-center gap-1">
            <Radio className="w-3 h-3" /> SATELLITE LINK: ACTIVE
          </span>
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-800 flex items-center justify-center text-white shadow-sm border border-sky-400/30">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 font-sans">
                ORCA<span className="text-sky-600">-X</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                v2.0 Marine Intelligence
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Agent Status Pill */}
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-medium">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>10 Agent Nodes Online</span>
          </div>

          {/* AI Copilot Trigger */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-sm transition-all hover:shadow"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-200" />
            <span className="hidden sm:inline">AI Marine Copilot</span>
            <span className="sm:hidden">Copilot</span>
          </button>

          {/* Language Selector */}
          <div className="relative inline-block text-left">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors">
              <Globe className="w-3.5 h-3.5 text-gray-500 mr-1.5" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer pr-2"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
