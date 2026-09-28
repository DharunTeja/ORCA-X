import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  FileText,
  Filter,
  Download,
  Calendar,
  Building,
  Tag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { LanguageCode, RAGDocument } from '../types';
import { searchRAG, fetchDocuments } from '../lib/api';

interface KnowledgeCenterPageProps {
  currentLang: LanguageCode;
  onOpenCopilot: () => void;
}

export const KnowledgeCenterPage: React.FC<KnowledgeCenterPageProps> = ({
  currentLang,
  onOpenCopilot,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDoc, setActiveDoc] = useState<RAGDocument | null>(null);

  const loadData = async (searchQuery = query, cat = selectedCategory, src = selectedSource) => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const results = await searchRAG(
          searchQuery,
          cat === 'All' ? undefined : cat,
          src === 'All' ? undefined : src
        );
        setDocuments(results);
        if (results.length > 0) setActiveDoc(results[0]);
      } else {
        const docs = await fetchDocuments(
          cat === 'All' ? undefined : cat,
          src === 'All' ? undefined : src
        );
        setDocuments(docs);
        if (docs.length > 0) setActiveDoc(docs[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedSource]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(query, selectedCategory, selectedSource);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            Marine Knowledge Center & Vector RAG Index
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Indexed archive of INCOIS PFZ Bulletins, IMD Tropical Cyclone SOPs, CMFRI Pelagic Assessments, and Marine Boundary Acts.
          </p>
        </div>

        <button
          onClick={onOpenCopilot}
          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
        >
          <span>Ask Marine RAG Agent</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, species (e.g. Yellowfin Tuna), regulations, SST, or bulletins..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-sm"
          >
            {loading ? 'Searching...' : 'Search Index'}
          </button>
        </form>

        {/* Category & Source Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {['All', 'Bulletin', 'Advisory', 'Research', 'Guideline'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-50 text-sky-900 border-sky-300 font-semibold'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-medium">Agency:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-medium focus:outline-none"
            >
              <option value="All">All Agencies</option>
              <option value="INCOIS">INCOIS</option>
              <option value="IMD">IMD</option>
              <option value="CMFRI">CMFRI</option>
              <option value="MoES">MoES</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List & Document Viewer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Results (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
            <span>Retrieved Documents ({documents.length})</span>
            <span className="text-[11px] font-mono text-gray-400">RAG Re-ranked</span>
          </div>

          <div className="space-y-2.5">
            {documents.map((doc) => {
              const isSelected = activeDoc?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all space-y-2 ${
                    isSelected
                      ? 'bg-white border-sky-500 shadow-card ring-2 ring-sky-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono bg-sky-100 text-sky-800 border border-sky-200">
                      {doc.source}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">
                      {doc.publication_date}
                    </span>
                  </div>
                  <div className="font-bold text-gray-900 line-clamp-2">
                    {doc.title}
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Document Full Preview & Key Findings (7 Cols) */}
        <div className="lg:col-span-7">
          {activeDoc ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-subtle space-y-4">
              <div className="border-b border-gray-100 pb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                    {activeDoc.category} • {activeDoc.source}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    Published: {activeDoc.publication_date}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {activeDoc.title}
                </h3>
              </div>

              {/* Summary Box */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                  Executive Summary & Abstract
                </div>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200 font-sans">
                  {activeDoc.summary}
                </p>
              </div>

              {/* Key Findings Bulleted */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                  Verified Scientific Insights & Regulatory Findings
                </div>
                <div className="space-y-1.5">
                  {activeDoc.key_findings.map((kf, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-sky-50/60 border border-sky-200 rounded-lg text-sky-950 font-medium"
                    >
                      • {kf}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & PDF Link */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() =>
                    alert(`Downloading official bulletin PDF: ${activeDoc.title}`)
                  }
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Verified Document (PDF)</span>
                </button>

                <button
                  onClick={onOpenCopilot}
                  className="px-3.5 py-2 text-sky-700 hover:bg-sky-50 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>Query AI Agent on this Paper</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-xs text-gray-500">
              Select a document from the left list to view details and scientific insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
