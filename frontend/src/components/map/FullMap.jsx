import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Heatmap Layer Component
function HeatmapLayer({ points, disasterMode, radius = 25 }) {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    const gradient = disasterMode ? {
      0.2: '#ff9999', 0.4: '#ff4444', 0.6: '#cc0000', 0.8: '#8b0000', 1.0: '#4a0000'
    } : {
      0.2: '#a5f3fc', 0.4: '#22d3ee', 0.6: '#0891b2', 0.8: '#155e75', 1.0: '#164e63'
    };

    heatLayerRef.current = L.heatLayer(points, {
      radius: disasterMode ? radius + 5 : radius,
      blur: 15,
      maxZoom: 17,
      gradient: gradient,
      minOpacity: 0.3,
      maxOpacity: 0.8
    });

    heatLayerRef.current.addTo(map);

    return () => {
      if (heatLayerRef.current) map.removeLayer(heatLayerRef.current);
    };
  }, [map, points, disasterMode, radius]);

  return null;
}

// Custom marker for reports
const getCitizenMarker = (type, isDisasterMode, status) => {
  let color = isDisasterMode ? '#ff2a2a' : '#06b6d4';
  if (status === 'COMPLETED') color = '#4ade80';
  if (type === 'MEDICAL') color = '#f97316';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}; ${status === 'PENDING' ? 'animation: pulse 1s infinite;' : ''}"></div>`,
    iconSize: [16, 16],
    popupAnchor: [0, -8],
  });
};

// Custom marker for tasks (Responder)
const getTaskMarker = (priority, status, disasterMode) => {
  let color = disasterMode ? '#ff2a2a' : 
              priority === 'HIGH' ? '#ef4444' : 
              priority === 'MEDIUM' ? '#fbbf24' : '#4ade80';
  if (status === 'COMPLETED') color = '#4ade80';
  
  const isPending = status === 'PENDING' || status === 'PENDING_RESPONDER';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: ${isPending ? '14px' : '10px'}; height: ${isPending ? '14px' : '10px'}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px ${color}; ${isPending ? 'animation: pulse 1s infinite;' : ''}"></div>`,
    iconSize: [18, 18],
    popupAnchor: [0, -8],
  });
};

export default function FullMap({ 
  items = [], 
  heatmapData = [], 
  disasterMode = false,
  center = [24.8607, 67.0011],
  zoom = 12,
  height = '500px',
  onMarkerClick,
  showHeatmap = true,
  heatmapRadius = 25,
  type = 'citizen' // 'citizen' or 'responder'
}) {
  const pendingCount = items.filter(i => i.status === 'PENDING' || i.status === 'PENDING_RESPONDER').length;
  const activeCount = items.filter(i => ['ACCEPTED', 'IN_PROGRESS', 'WITH_WORKER'].includes(i.status)).length;
  const completedCount = items.filter(i => i.status === 'COMPLETED').length;
  const highCount = items.filter(i => i.priority === 'HIGH' || i.severity === 'CRITICAL').length;

  return (
    <div className="space-y-3">
      {/* Map Legend & Stats */}
      <div className="flex flex-wrap justify-between items-center gap-2 text-[10px] font-mono">
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400">{type === 'citizen' ? 'Critical' : 'High Priority'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-yellow-400">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-green-400">Completed</span>
          </div>
          {showHeatmap && (
            <div className="flex items-center gap-1 ml-2">
              <div className="w-4 h-2 rounded bg-gradient-to-r from-cyan-400 via-yellow-400 to-red-500"></div>
              <span className="text-cyan-400/60">Heatmap Intensity</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <span className="text-red-400/80">🔴 {pendingCount} Pending</span>
          <span className="text-yellow-400/80">🟡 {activeCount} Active</span>
          <span className="text-green-400/80">🟢 {completedCount} Done</span>
          {highCount > 0 && <span className="text-red-400 animate-pulse">⚠️ {highCount} Critical</span>}
        </div>
      </div>

      {/* Map Container */}
      <div 
        className="rounded-lg overflow-hidden border border-cyan-500/30 shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all"
        style={{ height }}
      >
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />

          {/* Heatmap Layer */}
          {showHeatmap && heatmapData.length > 0 && (
            <HeatmapLayer points={heatmapData} disasterMode={disasterMode} radius={heatmapRadius} />
          )}

          {/* Circle Zones for Critical/High Priority Areas */}
          {items.filter(i => (i.priority === 'HIGH' || i.severity === 'CRITICAL') && i.latitude && i.longitude).slice(0, 5).map((item, idx) => (
            <Circle
              key={`circle-${idx}`}
              center={[item.latitude, item.longitude]}
              radius={800}
              pathOptions={{
                color: disasterMode ? '#ff2a2a' : '#ef4444',
                fillColor: disasterMode ? '#ff2a2a' : '#ef4444',
                fillOpacity: 0.1,
                weight: 1.5,
                className: 'animate-pulse'
              }}
            />
          ))}

          {/* Markers */}
          {items.filter(i => i.latitude && i.longitude).map((item) => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={type === 'citizen' 
                ? getCitizenMarker(item.type, disasterMode, item.status)
                : getTaskMarker(item.priority, item.status, disasterMode)
              }
              eventHandlers={{
                click: () => onMarkerClick?.(item)
              }}
            >
              <Popup className="map-popup-glass">
                <div className="p-2 min-w-[220px]">
                  <p className="font-data text-sm text-glow-primary">{item.title || item.type || `#${item.id}`}</p>
                  <p className="font-mono text-[10px] text-cyan-400/60 mt-1">📍 {item.locationAddress || item.area || 'Location not specified'}</p>
                  <div className="flex justify-between items-center mt-2">
                    {item.priority && (
                      <span className={`font-mono text-[9px] ${item.priority === 'HIGH' ? 'text-red-400' : item.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {item.priority} PRIORITY
                      </span>
                    )}
                    {item.severity && (
                      <span className={`font-mono text-[9px] ${item.severity === 'CRITICAL' ? 'text-red-400' : item.severity === 'HIGH' ? 'text-orange-400' : 'text-yellow-400'}`}>
                        {item.severity}
                      </span>
                    )}
                    <span className={`font-mono text-[9px] ${item.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.description && (
                    <p className="font-mono text-[9px] text-cyan-400/40 mt-2 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .map-popup-glass .leaflet-popup-content-wrapper {
          background: rgba(5, 9, 22, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 8px;
        }
        .map-popup-glass .leaflet-popup-tip {
          background: rgba(5, 9, 22, 0.95);
        }
      `}</style>
    </div>
  );
}