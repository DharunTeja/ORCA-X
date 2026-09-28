import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  Circle,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherPoint, OceanPoint, RouteOption } from '../types';

// Fix standard Leaflet default icon URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom colored marker icons using Leaflet DivIcon
const createDivIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      ">
        ${label}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const pfzIcon = createDivIcon('#0284C7', '🐟');
const weatherNormalIcon = createDivIcon('#10B981', '🌤️');
const weatherAlertIcon = createDivIcon('#EF4444', '⚠️');
const portIcon = createDivIcon('#1E3A8A', '⚓');
const waypointIcon = createDivIcon('#8B5CF6', '📍');

interface MapComponentProps {
  weatherStations?: WeatherPoint[];
  pfzZones?: OceanPoint[];
  gisLayers?: any;
  ports?: Record<string, any>;
  selectedRoute?: RouteOption | null;
  activeLayers?: {
    pfz: boolean;
    weather: boolean;
    mpas: boolean;
    imbl: boolean;
    ports: boolean;
    routes: boolean;
  };
  onMapClick?: (lat: number, lon: number) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  weatherStations = [],
  pfzZones = [],
  gisLayers = null,
  ports = {},
  selectedRoute = null,
  activeLayers = {
    pfz: true,
    weather: true,
    mpas: true,
    imbl: true,
    ports: true,
    routes: true,
  },
  onMapClick,
  center = [15.5, 80.5],
  zoom = 6,
  height = '560px',
}) => {
  return (
    <div className="w-full relative rounded-xl overflow-hidden border border-gray-200 shadow-subtle bg-slate-50 z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={center} zoom={zoom} />
        <MapEvents onMapClick={onMapClick} />

        {/* 1. Potential Fishing Zones (PFZ) Layer */}
        {activeLayers.pfz &&
          pfzZones.map((z, idx) => (
            <React.Fragment key={`pfz-${idx}`}>
              <Marker position={[z.latitude, z.longitude]} icon={pfzIcon}>
                <Popup>
                  <div className="p-1 space-y-1 max-w-xs text-xs font-sans">
                    <div className="flex items-center justify-between font-bold text-sky-900 border-b pb-1">
                      <span>{z.zone_id}</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono">
                        {(z.confidence_score * 100).toFixed(0)}% Conf
                      </span>
                    </div>
                    <p className="font-medium text-gray-800">{z.sector}</p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                      <div>SST: <b className="text-gray-900">{z.sst_celsius}°C</b></div>
                      <div>Chlorophyll: <b className="text-gray-900">{z.chlorophyll_mg_m3} mg/m³</b></div>
                      <div>Depth: <b className="text-gray-900">{z.depth_m || 45}m</b></div>
                      <div>Tide: <b className="text-gray-900">{z.tide_status}</b></div>
                    </div>
                    <div className="text-[11px] bg-emerald-50 text-emerald-800 p-1.5 rounded border border-emerald-200">
                      <b>Target Species:</b> {z.potential_species}
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[z.latitude, z.longitude]}
                radius={15000}
                pathOptions={{
                  color: '#0EA5E9',
                  fillColor: '#38BDF8',
                  fillOpacity: 0.15,
                  weight: 1.5,
                  dashArray: '4, 4',
                }}
              />
            </React.Fragment>
          ))}

        {/* 2. Weather & Hazard Stations Layer */}
        {activeLayers.weather &&
          weatherStations.map((w, idx) => {
            const isAlert = w.alert_level === 'Severe' || w.alert_level === 'Critical';
            return (
              <Marker
                key={`weather-${idx}`}
                position={[w.latitude, w.longitude]}
                icon={isAlert ? weatherAlertIcon : weatherNormalIcon}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs font-sans max-w-xs">
                    <div className="font-bold text-gray-900 border-b pb-1 flex justify-between items-center">
                      <span>{w.location_name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isAlert
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {w.alert_level}
                      </span>
                    </div>
                    <div className="text-gray-700">{w.condition}</div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                      <div>Temp: <b className="text-gray-900">{w.temperature_c}°C</b></div>
                      <div>Wind: <b className="text-gray-900">{w.wind_speed_knots} kts</b></div>
                      <div>Wave Height: <b className="text-gray-900">{w.wave_height_m} m</b></div>
                      <div>Pressure: <b className="text-gray-900">{w.pressure_hpa} hPa</b></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 3. Ports & Fishing Harbors */}
        {activeLayers.ports &&
          Object.entries(ports).map(([name, data]: [string, any], idx) => (
            <Marker
              key={`port-${idx}`}
              position={[data.lat, data.lon]}
              icon={portIcon}
            >
              <Popup>
                <div className="p-1 text-xs font-sans">
                  <div className="font-bold text-blue-900">{name}</div>
                  <div className="text-[11px] text-gray-600">{data.state} | {data.type}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 4. Marine Protected Areas (MPAs) */}
        {activeLayers.mpas &&
          gisLayers?.features
            ?.filter((f: any) => f.properties.layer_type === 'mpa')
            .map((mpa: any, idx: number) => {
              const coords = mpa.geometry.coordinates[0].map((c: any) => [c[1], c[0]]);
              return (
                <Polygon
                  key={`mpa-${idx}`}
                  positions={coords}
                  pathOptions={{
                    color: '#EF4444',
                    fillColor: '#F87171',
                    fillOpacity: 0.2,
                    weight: 2,
                    dashArray: '5, 5',
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs font-sans">
                      <div className="font-bold text-red-900">{mpa.properties.name}</div>
                      <div className="text-gray-700 text-[11px]">{mpa.properties.category}</div>
                      <div className="text-red-700 text-[10px] mt-1 font-semibold">
                        Restriction: {mpa.properties.restriction}
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

        {/* 5. International Maritime Boundary Lines (IMBL) */}
        {activeLayers.imbl &&
          gisLayers?.features
            ?.filter((f: any) => f.properties.layer_type === 'imbl')
            .map((imbl: any, idx: number) => {
              const coords = imbl.geometry.coordinates.map((c: any) => [c[1], c[0]]);
              return (
                <Polyline
                  key={`imbl-${idx}`}
                  positions={coords}
                  pathOptions={{
                    color: '#D97706',
                    weight: 3,
                    dashArray: '8, 6',
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs font-sans font-bold text-amber-900">
                      {imbl.properties.name}
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

        {/* 6. Selected Route Path & Waypoints */}
        {activeLayers.routes && selectedRoute && (
          <>
            <Polyline
              positions={selectedRoute.waypoints.map((w) => [w.latitude, w.longitude])}
              pathOptions={{
                color:
                  selectedRoute.route_type === 'Safe Route'
                    ? '#10B981'
                    : selectedRoute.route_type === 'Risk Avoidance Route'
                    ? '#0EA5E9'
                    : '#F59E0B',
                weight: 4,
                opacity: 0.85,
              }}
            />
            {selectedRoute.waypoints.map((wp, wIdx) => (
              <Marker
                key={`wp-${wIdx}`}
                position={[wp.latitude, wp.longitude]}
                icon={waypointIcon}
              >
                <Popup>
                  <div className="p-1 text-xs font-sans">
                    <div className="font-bold text-purple-900">{wp.name}</div>
                    <div className="text-gray-600 text-[11px]">
                      {wp.latitude.toFixed(4)}°N, {wp.longitude.toFixed(4)}°E
                    </div>
                    {wp.wave_height_m && (
                      <div className="text-[11px] text-gray-700 mt-1">
                        Wave: <b>{wp.wave_height_m}m</b> | Wind: <b>{wp.wind_speed_knots} kts</b>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};
