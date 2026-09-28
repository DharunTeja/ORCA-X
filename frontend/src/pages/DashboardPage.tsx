import React, { useState, useEffect } from 'react';
import {
  Ship,
  Waves,
  AlertTriangle,
  ShieldCheck,
  Compass,
  Layers,
  Wind,
  Thermometer,
  Radio,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { MapComponent } from '../components/MapComponent';
import { LanguageCode, WeatherPoint, OceanPoint, AlertItem } from '../types';
import { UI_TRANSLATIONS } from '../lib/translations';
import {
  fetchWeatherStations,
  fetchPFZZones,
  fetchAlerts,
  fetchGISLayers,
  fetchPorts,
} from '../lib/api';

interface DashboardPageProps {
  currentLang: LanguageCode;
  onOpenCopilot: () => void;
  onSelectCoordinate?: (lat: number, lon: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentLang,
  onOpenCopilot,
  onSelectCoordinate,
}) => {
  const t = UI_TRANSLATIONS[currentLang];
  const [weatherStations, setWeatherStations] = useState<WeatherPoint[]>([]);
  const [pfzZones, setPfzZones] = useState<OceanPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [gisLayers, setGisLayers] = useState<any>(null);
  const [ports, setPorts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Map layer toggle states
  const [layers, setLayers] = useState({
    pfz: true,
    weather: true,
    mpas: true,
    imbl: true,
    ports: true,
    routes: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [w, p, a, g, pr] = await Promise.all([
          fetchWeatherStations(),
          fetchPFZZones(),
          fetchAlerts(),
          fetchGISLayers(),
          fetchPorts(),
        ]);
        setWeatherStations(w);
        setPfzZones(p);
        setAlerts(a);
        setGisLayers(g);
        setPorts(pr);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMapClick = (lat: number, lon: number) => {
    if (onSelectCoordinate) {
      onSelectCoordinate(lat, lon);
    }
  };

  const chartData = [
    { sector: 'Visakha', sst: 27.4, chlorophyll: 1.85, wave: 1.8 },
    { sector: 'Kakinada', sst: 27.1, chlorophyll: 2.10, wave: 1.6 },
    { sector: 'Chennai', sst: 28.2, chlorophyll: 1.45, wave: 1.9 },
    { sector: 'Kochi', sst: 26.8, chlorophyll: 2.45, wave: 2.4 },
    { sector: 'Mumbai', sst: 27.6, chlorophyll: 1.70, wave: 2.1 },
    { sector: 'Paradip', sst: 26.5, chlorophyll: 2.30, wave: 2.8 },
    { sector: 'Mangaluru', sst: 27.9, chlorophyll: 1.95, wave: 1.7 },
    { sector: 'Veraval', sst: 25.9, chlorophyll: 2.60, wave: 2.2 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.activeVessels}
          value="1,420"
          subtext="AIS & VMS Telemetry Active"
          icon={<Ship className="w-4 h-4" />}
          trend={{ value: '+12% vs last week', isPositive: true }}
          color="blue"
        />
        <StatCard
          title={t.activePFZ}
          value={pfzZones.length || 8}
          subtext="INCOIS Thermal Gradients"
          icon={<Waves className="w-4 h-4" />}
          trend={{ value: 'High Catch Potential', isPositive: true }}
          color="sky"
        />
        <StatCard
          title={t.severeAlerts}
          value={alerts.length || 4}
          subtext="Bay of Bengal & Arabian Sea"
          icon={<AlertTriangle className="w-4 h-4" />}
          trend={{ value: '1 Deep Depression', isPositive: false }}
          color="red"
        />
        <StatCard
          title={t.safetyIndex}
          value="94.8%"
          subtext="Coastal Compliance Score"
          icon={<ShieldCheck className="w-4 h-4" />}
          trend={{ value: 'Normal Operational Limits', isPositive: true }}
          color="emerald"
        />
      </div>

      {/* Main Interactive Map & Layer Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-600" />
              {t.liveMap}
            </h2>
            <p className="text-xs text-gray-500">
              Live composite of INCOIS Potential Fishing Zones, IMD weather buoys, Marine Protected Areas, and IMBL boundaries. Click any point on the map to inspect.
            </p>
          </div>

          {/* Layer Toggle Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-gray-400 font-medium mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Layers:
            </span>
            <button
              onClick={() => setLayers((l) => ({ ...l, pfz: !l.pfz }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                layers.pfz
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
            >
              🐟 PFZ Zones
            </button>
            <button
              onClick={() => setLayers((l) => ({ ...l, weather: !l.weather }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                layers.weather
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
            >
              🌤️ Weather Buoys
            </button>
            <button
              onClick={() => setLayers((l) => ({ ...l, mpas: !l.mpas }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                layers.mpas
                  ? 'bg-red-50 text-red-800 border-red-300'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
            >
              🛡️ Protected MPAs
            </button>
            <button
              onClick={() => setLayers((l) => ({ ...l, imbl: !l.imbl }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                layers.imbl
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
            >
              ⚠️ IMBL Boundaries
            </button>
            <button
              onClick={() => setLayers((l) => ({ ...l, ports: !l.ports }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                layers.ports
                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
            >
              ⚓ Harbors
            </button>
          </div>
        </div>

        {/* Map Container */}
        <MapComponent
          weatherStations={weatherStations}
          pfzZones={pfzZones}
          gisLayers={gisLayers}
          ports={ports}
          activeLayers={layers}
          onMapClick={handleMapClick}
          height="540px"
        />
      </div>

      {/* Two Column Section: Active Advisories & Oceanographic Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Marine Advisories */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                {t.activeAdvisories}
              </h3>
              <span className="text-[11px] font-mono text-gray-500">
                Source: IMD & INCOIS Bulletin Feed
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((al) => {
                const isCrit = al.severity === 'Critical' || al.severity === 'High';
                return (
                  <div
                    key={al.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      isCrit
                        ? 'bg-red-50/60 border-red-200 text-red-950'
                        : 'bg-amber-50/50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{al.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          isCrit
                            ? 'bg-red-200 text-red-900'
                            : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {al.severity}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-700">
                      {al.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                      <span>Sector: <b>{al.region}</b></span>
                      <span>Category: <b>{al.category}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 mt-4">
            <button
              onClick={onOpenCopilot}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Consult AI Agent Regarding Storm Track</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ocean Productivity & SST Trends */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                Sea Surface Temperature & Chlorophyll Gradient
              </h3>
              <p className="text-xs text-gray-500">
                Multi-Sector Remote Sensing Telemetry (Sentinel-3 OLCI & NOAA AVHRR)
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="sector" tick={{ fontSize: 11 }} stroke="#6B7280" />
                <YAxis yAxisId="left" orientation="left" stroke="#0284C7" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0.75rem',
                    borderColor: '#E5E7EB',
                    fontSize: '11px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="sst" name="SST (°C)" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="chlorophyll" name="Chlorophyll (mg/m³)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5">
              <div className="font-semibold text-sky-900">Highest Biological Density</div>
              <div className="text-gray-600 text-[11px] mt-0.5">
                Kochi & Veraval fronts exceeding 2.4 mg/m³ chlorophyll.
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
              <div className="font-semibold text-emerald-900">Thermal Front Stability</div>
              <div className="text-gray-600 text-[11px] mt-0.5">
                Visakhapatnam & Kakinada stable within 26.5°C - 27.5°C range.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
