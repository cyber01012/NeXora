import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { authApi } from '../../api/authApi';
import { toast } from 'sonner';

const severityColors = {
  CRITICAL: { dot: '#ff2a2a', ring: 'rgba(255,42,42,0.3)', text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' },
  HIGH: { dot: '#fb923c', ring: 'rgba(251,146,60,0.3)', text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
  MEDIUM: { dot: '#facc15', ring: 'rgba(250,204,21,0.3)', text: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30' },
  LOW: { dot: '#4ade80', ring: 'rgba(74,222,128,0.3)', text: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30' },
};

export default function AdminHeatmap() {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const data = await authApi.getHeatmapData();
      setZones(data);
    } catch (error) {
      console.error('Failed to fetch heatmap data', error);
      toast.error('Failed to load real-time heatmap data');
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = filter === 'ALL'
    ? zones
    : zones.filter(z => z.severity === filter);

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">INCIDENT HEATMAP</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ GEOSPATIAL THREAT VISUALIZATION ]</p>
        </div>

        <div className="flex gap-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg border text-xs font-mono transition-all ${
                filter === s
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'border-[var(--border)] text-cyan-400/50 hover:text-cyan-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* MAP CONTAINER */}
        <div className="lg:col-span-2 bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden relative" style={{ minHeight: '500px', zIndex: 0 }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050916]">
              <span className="text-cyan-400 animate-pulse font-mono tracking-widest text-sm">LOADING SECURE MAP...</span>
            </div>
          ) : (
            <MapContainer
              center={[31.5204, 74.3587]} // Lahore default center
              zoom={12}
              style={{ height: '100%', width: '100%', background: '#050916' }}
            >
              {/* Dark mode Map tile layer */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
              />
              
              {/* Zone dots */}
              {filteredZones.map((zone) => {
                const color = severityColors[zone.severity] || severityColors.LOW;

                return (
                  <CircleMarker
                    key={zone.id}
                    center={[zone.lat, zone.lng]}
                    radius={Math.min(25, 8 + zone.incidents * 0.5)}
                    pathOptions={{
                      color: color.dot,
                      fillColor: color.dot,
                      fillOpacity: 0.6,
                      weight: 2
                    }}
                    eventHandlers={{
                      click: () => setSelectedZone(zone),
                    }}
                  >
                    <Tooltip className="bg-black/90 border-cyan-500/20 text-cyan-200 font-mono text-xs">
                      {zone.name} <br/> {zone.incidents} incidents
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}

          {/* Map label */}
          <div className="absolute bottom-4 left-4 text-[10px] font-mono text-cyan-400/80 bg-black/50 px-2 py-1 rounded tracking-widest z-[1000] pointer-events-none">
            NEXORA THREAT MAP • LIVE API
          </div>
        </div>

        {/* ZONE LIST */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-cyan-300 font-title text-sm tracking-wider mb-3">ACTIVE ZONES</h2>

          {loading ? (
            <div className="text-center py-10 text-cyan-400/40 font-mono text-sm">SYNCING DATA...</div>
          ) : filteredZones.length === 0 ? (
            <div className="text-center py-10 text-cyan-400/40 font-mono text-sm">NO DATA AVAILABLE</div>
          ) : filteredZones.map((zone) => {
            const color = severityColors[zone.severity] || severityColors.LOW;
            const isSelected = selectedZone?.id === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`
                  w-full text-left p-4 rounded-xl border transition-all
                  ${isSelected
                    ? `${color.bg} ${color.border} scale-[1.02]`
                    : 'bg-[var(--bg2)] border-[var(--border)] hover:border-cyan-500/30'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: color.dot, boxShadow: `0 0 8px ${color.dot}` }}
                    />
                    <span className="text-cyan-100 text-sm font-mono truncate max-w-[180px]">{zone.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-cyan-400/40 text-[10px] font-mono">{zone.type} • {zone.incidents} inc.</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${color.bg} ${color.border} ${color.text}`}>
                    {zone.severity}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED ZONE DETAIL */}
      {selectedZone && (
        <div className={`bg-[var(--bg2)] border ${severityColors[selectedZone.severity]?.border || 'border-cyan-500/30'} rounded-2xl p-5`}>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-glow-primary font-title text-lg">{selectedZone.name}</h2>
              <p className="text-cyan-400/50 text-xs font-mono mt-1">
                {selectedZone.type} • Coords: {selectedZone.lat.toFixed(4)}, {selectedZone.lng.toFixed(4)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-data text-3xl" style={{ color: severityColors[selectedZone.severity]?.dot || '#fff' }}>
                {selectedZone.incidents}
              </p>
              <p className="text-[10px] text-cyan-400/50 font-mono tracking-wider">INCIDENTS REPORTED</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Custom map tooltips matching our theme */
        .leaflet-tooltip {
          background-color: rgba(5, 9, 22, 0.9) !important;
          border: 1px solid rgba(6, 182, 212, 0.3) !important;
          color: #cffafe !important;
          border-radius: 8px !important;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: rgba(6, 182, 212, 0.3) !important;
        }
        
        /* Remove white borders on tiles */
        .leaflet-tile-container img {
          mix-blend-mode: plus-lighter;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}
