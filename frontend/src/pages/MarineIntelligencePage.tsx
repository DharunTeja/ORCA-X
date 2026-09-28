import React, { useState, useEffect } from 'react';
import {
  Waves,
  Thermometer,
  Activity,
  Compass,
  Fish,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { MapComponent } from '../components/MapComponent';
import { LanguageCode, OceanPoint } from '../types';
import { fetchPFZZones, fetchGISLayers, fetchPorts } from '../lib/api';

interface MarineIntelligencePageProps {
  currentLang: LanguageCode;
  onOpenCopilot: () => void;
}

export const MarineIntelligencePage: React.FC<MarineIntelligencePageProps> = ({
  currentLang,
  onOpenCopilot,
}) => {
  const [pfzZones, setPfzZones] = useState<OceanPoint[]>([]);
  const [gisLayers, setGisLayers] = useState<any>(null);
  const [ports, setPorts] = useState<Record<string, any>>({});
  const [selectedZone, setSelectedZone] = useState<OceanPoint | null>(null);
  const [sectorFilter, setSectorFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pz, gl, pt] = await Promise.all([
          fetchPFZZones(),
          fetchGISLayers(),
          fetchPorts(),
        ]);
        setPfzZones(pz);
        if (pz.length > 0) setSelectedZone(pz[0]);
        setGisLayers(gl);
        setPorts(pt);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredZones =
    sectorFilter === 'All'
      ? pfzZones
      : pfzZones.filter((z) => z.sector.includes(sectorFilter));

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Waves className="w-5 h-5 text-sky-600" />
            Potential Fishing Zones (PFZ) & Ocean State Intelligence
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Operational satellite-derived thermal boundaries and ocean color gradients provided by INCOIS & Sentinel-3 OLCI.
          </p>
        </div>

        {/* Sector Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none"
          >
            <option value="All">All Coastal Sectors</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Kerala">Kerala</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Odisha">Odisha</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>
      </div>

      {/* Main Map-First View & Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-600" />
              INCOIS Ocean Front Geospatial Mesh
            </span>
            <span className="text-[11px] font-mono text-gray-500">
              Showing {filteredZones.length} Valid Fronts
            </span>
          </div>

          <MapComponent
            pfzZones={filteredZones}
            gisLayers={gisLayers}
            ports={ports}
            activeLayers={{
              pfz: true,
              weather: false,
              mpas: true,
              imbl: true,
              ports: true,
              routes: false,
            }}
            center={
              selectedZone
                ? [selectedZone.latitude, selectedZone.longitude]
                : [15.5, 80.5]
            }
            zoom={selectedZone ? 7 : 6}
            height="520px"
          />
        </div>

        {/* Selected Zone Deep Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedZone ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200 font-mono">
                    {selectedZone.zone_id}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-1">
                    {selectedZone.sector}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {selectedZone.latitude.toFixed(4)}°N, {selectedZone.longitude.toFixed(4)}°E
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600 font-mono">
                    {(selectedZone.confidence_score * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">Validation Conf</div>
                </div>
              </div>

              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3">
                  <div className="text-[11px] text-sky-800 font-medium flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                    Sea Surface Temp (SST)
                  </div>
                  <div className="text-lg font-bold text-sky-950 mt-1">
                    {selectedZone.sst_celsius}°C
                  </div>
                  <div className="text-[10px] text-sky-700">Thermal Front Boundary</div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                  <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    Chlorophyll-a
                  </div>
                  <div className="text-lg font-bold text-emerald-950 mt-1">
                    {selectedZone.chlorophyll_mg_m3} mg/m³
                  </div>
                  <div className="text-[10px] text-emerald-700">High Phytoplankton Density</div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="text-[11px] text-gray-600 font-medium">Current Velocity</div>
                  <div className="text-base font-bold text-gray-900 mt-1">
                    {selectedZone.current_speed_knots} kts @ {selectedZone.current_direction_deg}°
                  </div>
                  <div className="text-[10px] text-gray-500">Surface Drift Vector</div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="text-[11px] text-gray-600 font-medium">Tidal Regime</div>
                  <div className="text-base font-bold text-gray-900 mt-1">
                    {selectedZone.tide_status}
                  </div>
                  <div className="text-[10px] text-gray-500">Salinity: {selectedZone.salinity_psu} PSU</div>
                </div>
              </div>

              {/* Target Marine Species */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 space-y-1.5">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Fish className="w-4 h-4 text-emerald-600" />
                  Target Commercial Pelagic Species
                </div>
                <div className="text-xs text-emerald-950 font-medium">
                  {selectedZone.potential_species}
                </div>
              </div>

              {/* Advisory Text */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed space-y-1">
                <div className="font-bold text-slate-900">Official INCOIS Advisory</div>
                <p>{selectedZone.advisory}</p>
              </div>

              <button
                onClick={onOpenCopilot}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <span>Synthesize Voyage & Catch Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-xs text-gray-500">
              Select a Potential Fishing Zone from the list below or on the map.
            </div>
          )}
        </div>
      </div>

      {/* Grid of all Active PFZ Zones */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Active Potential Fishing Zone Bulletin Catalog
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredZones.map((z) => {
            const isSelected = selectedZone?.zone_id === z.zone_id;
            return (
              <button
                key={z.zone_id}
                onClick={() => setSelectedZone(z)}
                className={`text-left p-3 rounded-xl border text-xs transition-all space-y-2 ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-900 font-mono text-[11px]">
                    {z.zone_id}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                    {(z.confidence_score * 100).toFixed(0)}% Conf
                  </span>
                </div>
                <div className="font-semibold text-gray-900 truncate">
                  {z.sector}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                  <div>SST: <b>{z.sst_celsius}°C</b></div>
                  <div>Chl-a: <b>{z.chlorophyll_mg_m3} mg</b></div>
                </div>
                <div className="text-[10px] text-emerald-700 bg-emerald-50/50 p-1 rounded border border-emerald-100 truncate">
                  {z.potential_species}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
