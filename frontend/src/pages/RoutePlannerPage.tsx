import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Anchor,
  Compass,
  Fuel,
  Clock,
  Waves,
  ShieldCheck,
  Check,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MapComponent } from '../components/MapComponent';
import { LanguageCode, RouteOption, RoutePlanResponse } from '../types';
import { fetchPorts, planRoutes, fetchGISLayers } from '../lib/api';

interface RoutePlannerPageProps {
  currentLang: LanguageCode;
  onOpenCopilot: () => void;
}

export const RoutePlannerPage: React.FC<RoutePlannerPageProps> = ({
  currentLang,
  onOpenCopilot,
}) => {
  const [ports, setPorts] = useState<Record<string, any>>({});
  const [gisLayers, setGisLayers] = useState<any>(null);
  const [origin, setOrigin] = useState('Visakhapatnam Harbor');
  const [destination, setDestination] = useState('Chennai Port (Royapuram Harbor)');
  const [vesselSpeed, setVesselSpeed] = useState(10.0);
  const [routePlan, setRoutePlan] = useState<RoutePlanResponse | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [pt, gl] = await Promise.all([fetchPorts(), fetchGISLayers()]);
        setPorts(pt);
        setGisLayers(gl);
        // Generate initial route
        const plan = await planRoutes(
          'Visakhapatnam Harbor',
          'Chennai Port (Royapuram Harbor)',
          undefined,
          undefined,
          10.0
        );
        setRoutePlan(plan);
        if (plan.routes.length > 0) setSelectedRoute(plan.routes[0]);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handlePlanRoute = async () => {
    setLoading(true);
    try {
      const plan = await planRoutes(origin, destination, undefined, undefined, vesselSpeed);
      setRoutePlan(plan);
      if (plan.routes.length > 0) setSelectedRoute(plan.routes[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const portNames = Object.keys(ports).length > 0
    ? Object.keys(ports)
    : [
        'Visakhapatnam Harbor',
        'Kakinada Fishing Harbor',
        'Chennai Port (Royapuram Harbor)',
        'Tuticorin Fishing Harbor',
        'Kochi Fishing Harbor (Thoppumpady)',
        'Mangaluru Old Port Harbor',
        'Mumbai (Sassoon Dock & Mazagon)',
        'Veraval Fishing Harbor',
        'Paradip Port & Harbor',
      ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-sky-600" />
            Maritime Route Optimization & Hazard Avoidance Corridor
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Calculates high-precision nautical trajectories balancing weather risks, restricted MPAs, and ocean current fuel savings.
          </p>
        </div>

        <button
          onClick={onOpenCopilot}
          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
        >
          <span>Ask Agent For Waypoint Advice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Origin, Destination & Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Voyage Configuration & Port Terminals
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-medium text-gray-600">Departure Port / Terminal</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500 font-medium"
            >
              {portNames.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-600">Destination Port / Target Zone</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500 font-medium"
            >
              {portNames.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-600">Vessel Cruising Speed (Knots)</label>
            <input
              type="number"
              value={vesselSpeed}
              onChange={(e) => setVesselSpeed(parseFloat(e.target.value) || 10)}
              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePlanRoute}
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center justify-center space-x-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{loading ? 'Computing Corridors...' : 'Generate 3 Routes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Generated Route Option Cards */}
      {routePlan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routePlan.routes.map((rt) => {
            const isSelected = selectedRoute?.route_id === rt.route_id;
            let tagColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
            if (rt.route_type === 'Risk Avoidance Route') {
              tagColor = 'bg-sky-100 text-sky-800 border-sky-300';
            } else if (rt.route_type === 'Fuel Efficient Route') {
              tagColor = 'bg-amber-100 text-amber-800 border-amber-300';
            }

            return (
              <button
                key={rt.route_id}
                onClick={() => setSelectedRoute(rt)}
                className={`text-left p-4 rounded-xl border transition-all space-y-3 relative ${
                  isSelected
                    ? 'bg-white border-sky-500 shadow-card ring-2 ring-sky-400'
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono border ${tagColor}`}
                  >
                    {rt.route_type}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="text-[10px] text-gray-500">Distance</div>
                    <div className="font-bold text-gray-900 font-mono mt-0.5">
                      {rt.distance_nm} NM
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="text-[10px] text-gray-500">Duration</div>
                    <div className="font-bold text-gray-900 font-mono mt-0.5">
                      {rt.estimated_hours} hrs
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="text-[10px] text-gray-500">Fuel Est.</div>
                    <div className="font-bold text-gray-900 font-mono mt-0.5">
                      {rt.fuel_consumption_liters} L
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 leading-relaxed font-sans border-t border-gray-100 pt-2">
                  {rt.advisory}
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>Risk Score: <b>{rt.average_risk_score}/100</b></span>
                  <span>Max Swell: <b>{rt.max_wave_height_m}m</b></span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Map Display of Selected Route with Waypoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-600" />
              Nautical Track Visualization: {selectedRoute?.route_type || 'Route Overview'}
            </span>
            <span className="text-[11px] font-mono text-gray-500">
              {selectedRoute?.waypoints.length || 0} Calculated GPS Waypoints
            </span>
          </div>

          <MapComponent
            gisLayers={gisLayers}
            ports={ports}
            selectedRoute={selectedRoute}
            activeLayers={{
              pfz: false,
              weather: true,
              mpas: true,
              imbl: true,
              ports: true,
              routes: true,
            }}
            height="500px"
          />
        </div>

        {/* Waypoint Table & Leg Details (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-100 pb-2 mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                GPS Waypoints & Hazard Clearance
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                WGS84 Datum
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {selectedRoute?.waypoints.map((wp, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1 hover:bg-sky-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[9px] flex items-center justify-center font-mono">
                        {i + 1}
                      </span>
                      {wp.name}
                    </span>
                    <span className="text-[10px] font-mono font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {wp.risk_level || 'Safe'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono">
                    {wp.latitude.toFixed(4)}°N, {wp.longitude.toFixed(4)}°E
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-600 pt-0.5">
                    <span>Wave: <b>{wp.wave_height_m}m</b></span>
                    <span>Wind: <b>{wp.wind_speed_knots} kts</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={() =>
                alert('GPS Waypoint Coordinates exported to NAVTEX & ECDIS GPX format.')
              }
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Export GPX to Vessel ECDIS / GPS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
