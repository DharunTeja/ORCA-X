import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Database,
  Search,
  Scale,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LanguageCode } from '../types';
import { executeAgentQuery } from '../lib/api';

interface ExplainabilityPageProps {
  currentLang: LanguageCode;
  onOpenCopilot: () => void;
}

export const ExplainabilityPage: React.FC<ExplainabilityPageProps> = ({
  currentLang,
  onOpenCopilot,
}) => {
  const [selectedCase, setSelectedCase] = useState(
    'Visakhapatnam PFZ Sector vs. Bay of Bengal Squall'
  );

  const testCases = [
    'Visakhapatnam PFZ Sector vs. Bay of Bengal Squall',
    'Gulf of Mannar Coral Sanctuary MPA Fishing Restriction',
    'Kochi Shelf Edge Chlorophyll Front Validation',
    'Veraval Saurashtra Coastline Winter Upwelling',
  ];

  const factorWeights = [
    { factor: 'INCOIS PFZ Front (SST Gradient)', weight: 35, confidence: 96 },
    { factor: 'IMD Wind & Squall Hazard', weight: 25, confidence: 94 },
    { factor: 'Swell Wave Safety Envelope', weight: 20, confidence: 95 },
    { factor: 'MPA & IMBL Spatial Geofence', weight: 20, confidence: 99 },
  ];

  const evidenceRecords = [
    {
      agent: 'Ocean Agent',
      source: 'INCOIS PFZ Daily Advisory #842 & Sentinel-3 OLCI',
      finding:
        'Thermal gradient detected at 27.4°C with chlorophyll-a at 1.85 mg/m³. Pelagic shoals (Yellowfin Tuna, Ribbon Fish) foraging probability calculated at 92%.',
      reliability: '96%',
      status: 'VERIFIED',
    },
    {
      agent: 'Weather Agent',
      source: 'IMD Coastal Doppler Radar & Weather Buoy Network',
      finding:
        'Sustained wind velocity 14 knots from SE with 1.8m swell waves. Atmospheric pressure at 1011.2 hPa. No convective squall cell detected within 30 NM radius.',
      reliability: '94%',
      status: 'VERIFIED',
    },
    {
      agent: 'GIS Agent',
      source: 'National Marine Spatial Data Infrastructure (NMSDI)',
      finding:
        'Vessel position is 28.4 km offshore Visakhapatnam. Distance to closest MPA is >140 km. Distance to International Boundary is >280 km. Spatial clearance 100%.',
      reliability: '99%',
      status: 'VERIFIED',
    },
    {
      agent: 'Reasoning Engine',
      source: 'ORCA-X Cross-Agent Fusion Matrix',
      finding:
        'Oceanic biological upside (high CPUE expected) significantly outweighs minor sea state resistance. Standard Safe Corridor navigation approved.',
      reliability: '95%',
      status: 'CONSENSUS REACHED',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            Explainable AI (XAI) Marine Reasoning Center
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent evidentiary audits, multi-source sensor attribution, and step-by-step agent reasoning traces.
          </p>
        </div>

        <button
          onClick={onOpenCopilot}
          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
        >
          <span>Run Custom Explainability Query</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Case Selector Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-subtle flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wider">
          Audited Scenario:
        </span>
        {testCases.map((tc) => (
          <button
            key={tc}
            onClick={() => setSelectedCase(tc)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              selectedCase === tc
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {tc}
          </button>
        ))}
      </div>

      {/* Rationale & Factor Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Rationale Summary (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 shadow-subtle space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                Consensus Confirmed (95.4%)
              </span>
              <h3 className="text-sm font-bold text-gray-900 mt-1">
                Why was this Marine Advisory & Route Generated?
              </h3>
            </div>
            <Scale className="w-5 h-5 text-sky-600" />
          </div>

          <div className="space-y-3 text-xs text-gray-700 leading-relaxed font-sans">
            <p>
              1. <b>Oceanographic Opportunity</b>: INCOIS satellite telemetry detected a stable Sea Surface Temperature (SST) thermal front at <b>27.4°C</b> coinciding with elevated Chlorophyll-a (<b>1.85 mg/m³</b>). This environment produces high zooplankton aggregation and a <b>92% probability of pelagic fish shoals</b>.
            </p>
            <p>
              2. <b>Atmospheric Clearance</b>: Surface wind speed of <b>14 knots</b> and significant wave height of <b>1.8 meters</b> remain well below the IMD severe squall threshold (28 knots / 3.5m waves), confirming safe operational conditions for mechanized trawlers.
            </p>
            <p>
              3. <b>Zero Boundary Collisions</b>: The target fishing area is located in authorized Indian Exclusive Economic Zone (EEZ) waters, with zero overlap with Marine Protected Area (MPA) boundaries and over 280 km buffer from International Maritime Boundary Lines.
            </p>
          </div>

          {/* Calibrated Confidence Rating */}
          <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-sky-900">
                Calibrated System Confidence Score
              </div>
              <div className="text-[11px] text-sky-700 mt-0.5">
                Weighted combination of 4 independent sensor feeds
              </div>
            </div>
            <div className="text-2xl font-bold font-mono text-sky-950">
              95.4%
            </div>
          </div>
        </div>

        {/* Multi-Criteria Decision Factor Weights Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-5 shadow-subtle space-y-3">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Decision Feature Importance & Weights
            </h3>
            <p className="text-[11px] text-gray-500">
              Contribution of telemetry dimensions to final agent decision
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={factorWeights}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 10 }} stroke="#6B7280" />
                <YAxis dataKey="factor" type="category" tick={{ fontSize: 10 }} width={90} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="weight" name="Weight (%)" fill="#0284C7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Multi-Source Evidentiary Audit Log */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-600" />
            Verified Telemetry Source Logs & Evidentiary Attributions
          </h3>
          <span className="text-[11px] font-mono text-gray-500">
            4 Multi-Agency Attributions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidenceRecords.map((ev, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {ev.agent}
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {ev.status} • {ev.reliability}
                </span>
              </div>
              <div className="text-[11px] text-sky-900 font-semibold font-mono">
                {ev.source}
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-sans">
                {ev.finding}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
