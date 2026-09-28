import React, { useState } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Cpu,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { LanguageCode, AgentQueryResponse } from '../types';
import { LANGUAGES, UI_TRANSLATIONS } from '../lib/translations';
import { executeAgentQuery } from '../lib/api';
import { useVoice } from '../hooks/useVoice';

interface AgentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
}

export const AgentChatModal: React.FC<AgentChatModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[currentLang];
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentQueryResponse | null>(null);
  const [selectedLangTab, setSelectedLangTab] = useState<LanguageCode>(currentLang);

  const { isListening, isSpeaking, startListening, speak, stopSpeaking } = useVoice(
    selectedLangTab
  );

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const response = await executeAgentQuery(q, selectedLangTab);
      setResult(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) return;
    startListening((spokenText) => {
      setQuery(spokenText);
      handleSend(spokenText);
    });
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text, selectedLangTab);
    }
  };

  const quickPrompts = [
    'Assess fishing viability & cyclone risk off Visakhapatnam',
    'What are the active IMBL restrictions near Gulf of Mannar?',
    'Is sea surface temperature and chlorophyll optimal near Kochi?',
    'Plan a safe route from Chennai Port to Kakinada avoiding high swells',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  ORCA-X Multi-Agent Marine Intelligence Copilot
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono">
                  10 Agents Linked
                </span>
              </div>
              <p className="text-xs text-slate-400">
                LangGraph Multi-Agent Orchestration • IMD Weather • INCOIS PFZ • GIS Boundaries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Quick Prompts */}
          {!result && !loading && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Suggested Marine Intelligence Queries
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(p);
                      handleSend(p);
                    }}
                    className="text-left text-xs text-gray-700 bg-gray-50 hover:bg-sky-50 hover:text-sky-900 hover:border-sky-200 border border-gray-200 p-3 rounded-xl transition-all flex items-start justify-between group"
                  >
                    <span>{p}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sky-600 shrink-0 mt-0.5 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State with simulated Agent DAG steps */}
          {loading && (
            <div className="space-y-4 py-8 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin mx-auto"></div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-gray-800">
                  Executing Multi-Agent Decision Graph...
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  Intent Agent → Planner → Weather/Ocean/GIS Ingestion → RAG → Reasoning Engine → Risk/Route
                </div>
              </div>
            </div>
          )}

          {/* Execution Result */}
          {result && !loading && (
            <div className="space-y-5">
              {/* Language Switcher Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-gray-200 pb-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLangTab(lang.code)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedLangTab === lang.code
                        ? 'bg-sky-600 text-white font-semibold shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>

              {/* Primary Response Box */}
              <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4 relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    Agent Consensus Assessment
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono bg-white border border-sky-200 text-sky-800 px-2 py-0.5 rounded">
                      Confidence: {(result.confidence_score * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={() =>
                        handleSpeak(
                          result.translated_responses[selectedLangTab] ||
                            result.response_text
                        )
                      }
                      className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                        isSpeaking
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      title="Read aloud in selected language"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? 'Stop Audio' : 'Voice Out'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line font-sans">
                  {result.translated_responses[selectedLangTab] || result.response_text}
                </div>
              </div>

              {/* Suggested Actions */}
              {result.suggested_actions?.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Recommended Operational Actions
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.suggested_actions.map((act, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-2 text-xs text-gray-700 bg-white p-2 rounded-lg border border-gray-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-Agent DAG Execution Trace */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-600" />
                    Multi-Agent DAG Execution Trace ({result.execution_trace.length} Steps)
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">
                    Execution Time: 1.15s
                  </span>
                </div>
                <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto bg-white">
                  {result.execution_trace.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 text-xs flex items-start justify-between space-x-3 hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {step.agent_name}
                            <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 rounded">
                              {step.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-600 mt-0.5 font-sans">
                            {step.details}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 shrink-0">
                        {step.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Query Input */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
              title={isListening ? t.listening : t.voiceInput}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? t.listening : t.askCopilot}
              className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-sm"
            />

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>{t.search}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
