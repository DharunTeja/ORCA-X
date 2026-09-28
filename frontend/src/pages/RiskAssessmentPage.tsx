import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Wind,
  Waves,
  Compass,
  MapPin,
  CheckCircle2,
  XCircle,
  Globe,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { LanguageCode, RiskAssessment } from '../types';
import { LANGUAGES, UI_TRANSLATIONS } from '../lib/translations';
import { evaluateRisk } from '../lib/api';

interface RiskAssessmentPageProps {
  currentLang: LanguageCode;
  onOpenCopilot: () => void;
  selectedCoordinate?: { lat: number; lon: number } | null;
}

export const RiskAssessmentPage: React.FC<RiskAssessmentPageProps> = ({
  currentLang,
  onOpenCopilot,
  selectedCoordinate,
}) => {
  const [lat, setLat] = useState<number>(selectedCoordinate?.lat || 17.6868);
  const [lon, setLon] = useState<number>(selectedCoordinate?.lon || 83.2185);
  const [vesselType, setVesselType] = useState('Mechanized Trawler');
  const [vesselLength, setVesselLength] = useState(18.0);
  const [riskData, setRiskData] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [advisoryLang, setAdvisoryLang] = useState<LanguageCode>(currentLang);

  const runEvaluation = async (evalLat = lat, evalLon = lon) => {
    setLoading(true);
    try {
      const res = await evaluateRisk(evalLat, evalLon, vesselType, vesselLength);
      setRiskData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runEvaluation();
  }, []);

  useEffect(() => {
    if (selectedCoordinate) {
      setLat(selectedCoordinate.lat);
      setLon(selectedCoordinate.lon);
      runEvaluation(selectedCoordinate.lat, selectedCoordinate.lon);
    }
  }, [selectedCoordinate]);

  const quickHotspots = [
    { name: 'Visakhapatnam Shelf', lat: 17.6868, lon: 83.2185 },
    { name: 'Bay of Bengal Central Depression', lat: 15.2000, lon: 86.8000 },
    { name: 'Gulf of Mannar (Near IMBL & MPA)', lat: 9.1500, lon: 79.1000 },
    { name: 'Kochi Offshore Shelf', lat: 9.9312, lon: 76.2673 },
    { name: 'Gahirmatha Olive Ridley Sanctuary', lat: 20.7200, lon: 87.0500 },
  ];

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Medium':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Low':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const pieData = riskData
    ? [
        { name: 'Wave Risk', value: riskData.wave_risk, color: '#0EA5E9' },
        { name: 'Storm & Wind Risk', value: riskData.storm_risk, color: '#F59E0B' },
        { name: 'Cyclone Risk', value: riskData.cyclone_risk, color: '#EF4444' },
        { name: 'Boundary & MPA Risk', value: riskData.boundary_risk, color: '#8B5CF6' },
      ]
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            Operational Maritime Risk Assessment Engine
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Multi-parametric hazard evaluation based on IMD squall vectors, INCOIS high swell forecasts, and IMBL/MPA geofences.
          </p>
        </div>

        <button
          onClick={onOpenCopilot}
          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Consult Risk Agent</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Coordinate & Vessel Input Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Target Marine Coordinates & Vessel Parameters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] font-medium text-gray-600">Latitude (°N)</label>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-600">Longitude (°E)</label>
            <input
              type="number"
              step="0.0001"
              value={lon}
              onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-600">Vessel Category</label>
            <select
              value={vesselType}
              onChange={(e) => setVesselType(e.target.value)}
              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500"
            >
              <option value="Mechanized Trawler">Mechanized Trawler</option>
              <option value="Motorized Artisanal Craft">Motorized Artisanal Craft</option>
              <option value="Deep Sea Gillnetter">Deep Sea Gillnetter</option>
              <option value="Commercial Cargo / Tug">Commercial Cargo / Tug</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-600">Overall Length (m)</label>
            <input
              type="number"
              value={vesselLength}
              onChange={(e) => setVesselLength(parseFloat(e.target.value) || 12)}
              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => runEvaluation()}
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              {loading ? 'Evaluating...' : 'Evaluate Sector Risk'}
            </button>
          </div>
        </div>

        {/* Quick Hotspot Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-400 font-medium">Quick Evaluator Hotspots:</span>
          {quickHotspots.map((hs, i) => (
            <button
              key={i}
              onClick={() => {
                setLat(hs.lat);
                setLon(hs.lon);
                runEvaluation(hs.lat, hs.lon);
              }}
              className="px-2.5 py-1 bg-gray-50 hover:bg-sky-50 hover:border-sky-300 text-gray-700 text-[11px] rounded-lg border border-gray-200 transition-colors"
            >
              {hs.name}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Result Cards */}
      {riskData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Composite Score Card (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Composite Risk Index
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase font-mono ${getSeverityBadgeClass(
                    riskData.severity
                  )}`}
                >
                  {riskData.severity} Severity
                </span>
              </div>

              <div className="mt-4 text-center">
                <div className="text-5xl font-black text-gray-900 font-mono tracking-tight">
                  {riskData.overall_score}
                  <span className="text-xl font-normal text-gray-400">/100</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Sector Navigation Safety Rating
                </p>
              </div>
            </div>

            {/* Breakdown Donut Chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.5rem',
                      borderColor: '#E5E7EB',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Geofence Status Tags */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Marine Protected Area:</span>
                {riskData.is_in_mpa ? (
                  <span className="text-red-700 font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> INSIDE RESTRICTED MPA
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> CLEAR
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">IMBL Boundary Status:</span>
                {riskData.is_near_imbl ? (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> NEAR MARITIME BORDER
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SAFE INDIAN EEZ
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Risk Factors & Regional Multilingual Advisory (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 4 Factor Matrix Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
                <div className="text-sky-800 font-semibold flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5 text-sky-600" />
                  Wave & Swell
                </div>
                <div className="text-xl font-bold text-sky-950 font-mono mt-1">
                  {riskData.wave_risk} / 30
                </div>
                <div className="text-[10px] text-sky-700 mt-0.5">Significant wave height</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="text-amber-800 font-semibold flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-amber-600" />
                  Storm & Wind
                </div>
                <div className="text-xl font-bold text-amber-950 font-mono mt-1">
                  {riskData.storm_risk} / 30
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">Sustained squall velocity</div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <div className="text-red-800 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Cyclone Track
                </div>
                <div className="text-xl font-bold text-red-950 font-mono mt-1">
                  {riskData.cyclone_risk} / 20
                </div>
                <div className="text-[10px] text-red-700 mt-0.5">Depression proximity</div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                <div className="text-purple-800 font-semibold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-purple-600" />
                  Boundary/MPA
                </div>
                <div className="text-xl font-bold text-purple-950 font-mono mt-1">
                  {riskData.boundary_risk} / 20
                </div>
                <div className="text-[10px] text-purple-700 mt-0.5">Geofence compliance</div>
              </div>
            </div>

            {/* Multilingual Emergency Advisory Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-600" />
                  Localized Fleet Safety Advisory
                </div>

                {/* Regional Language Tabs */}
                <div className="flex flex-wrap gap-1">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setAdvisoryLang(l.code)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                        advisoryLang === l.code
                          ? 'bg-sky-600 text-white font-semibold shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {l.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
                {riskData.regional_advisory?.[advisoryLang] || riskData.summary}
              </div>

              {/* Actionable Advisories */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  Mandated Operational Directives:
                </div>
                {riskData.advisories.map((adv, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
