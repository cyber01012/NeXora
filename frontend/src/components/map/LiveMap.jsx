import { useEffect, useRef, useState } from 'react';
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

// Karachi coordinates
const KARACHI_CENTER = [24.8607, 67.0011];
const KARACHI_BOUNDS = [
  [24.75, 66.90],
  [24.95, 67.15]
];

// Heatmap Layer Component
function HeatmapLayer({ points, disasterMode, radius = 25 }) {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (!map || !points || points.length === 0) return;
    if (heatLayerRef.current) map.removeLayer(heatLayerRef.current);

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

    return () => { if (heatLayerRef.current) map.removeLayer(heatLayerRef.current); };
  }, [map, points, disasterMode, radius]);

  return null;
}

// Get marker color based on priority/severity
const getMarkerColor = (priority, status, disasterMode) => {
  if (disasterMode) return '#ff2a2a';
  if (status === 'COMPLETED') return '#4ade80';
  if (priority === 'CRITICAL' || priority === 'HIGH') return '#ef4444';
  if (priority === 'MEDIUM') return '#fbbf24';
  return '#06b6d4';
};

// Generate heatmap points from markers
const generateHeatmapPoints = (markers) => {
  if (!markers || markers.length === 0) return [];
  
  const locationMap = new Map();
  
  markers.forEach(m => {
    const lat = m.latitude;
    const lng = m.longitude;
    if (!lat || !lng) return;
    
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    const existing = locationMap.get(key);
    
    if (existing) {
      existing.count++;
      let intensityAdd = 0.1;
      if (m.priority === 'HIGH') intensityAdd = 0.3;
      else if (m.priority === 'MEDIUM') intensityAdd = 0.2;
      existing.intensity += intensityAdd;
    } else {
      let intensity = 0.1;
      if (m.priority === 'HIGH') intensity = 0.3;
      else if (m.priority === 'MEDIUM') intensity = 0.2;
      locationMap.set(key, { lat, lng, count: 1, intensity });
    }
  });
  
  const maxIntensity = Math.max(...Array.from(locationMap.values()).map(v => v.intensity), 0.5);
  
  return Array.from(locationMap.values()).map(point => [
    point.lat,
    point.lng,
    Math.min(0.3 + (point.intensity / maxIntensity) * 0.7, 1.0)
  ]);
};

export default function LiveMap({ 
  markers = [], 
  zones = [],
  disasterMode = false,
  height = '400px',
  showHeatmap = true,
  onMarkerClick
}) {
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    setMapKey(Date.now());
  }, [disasterMode, markers.length]);

  const heatmapPoints = showHeatmap ? generateHeatmapPoints(markers) : [];
  
  const pendingCount = markers.filter(m => m.status === 'PENDING' || m.status === 'PENDING_RESPONDER').length;
  const inProgressCount = markers.filter(m => ['IN_PROGRESS', 'ACCEPTED', 'WITH_WORKER'].includes(m.status)).length;
  const completedCount = markers.filter(m => m.status === 'COMPLETED').length;
  const criticalCount = markers.filter(m => m.priority === 'HIGH' || m.priority === 'CRITICAL').length;

  return (
    <div className="space-y-3">
      {/* Map Legend & Stats */}
      <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400 text-xs">High Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-yellow-400 text-xs">Medium/Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-green-400 text-xs">Completed/Low</span>
          </div>
          {showHeatmap && heatmapPoints.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-5 h-3 rounded bg-gradient-to-r from-cyan-400 via-yellow-400 to-red-500"></div>
              <span className="text-cyan-400/70 text-xs">Heatmap</span>
            </div>
          )}
        </div>
        <div className="flex gap-3 text-xs">
          {criticalCount > 0 && <span className="text-red-400 animate-pulse">🔴 {criticalCount} Critical</span>}
          <span className="text-yellow-400">🟡 {pendingCount} Pending</span>
          <span className="text-cyan-400">🔵 {inProgressCount} Active</span>
          <span className="text-green-400">🟢 {completedCount} Done</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden border border-cyan-500/30 shadow-lg" style={{ height }}>
        <MapContainer 
          key={mapKey}
          center={KARACHI_CENTER} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }} 
          scrollWheelZoom
          bounds={KARACHI_BOUNDS}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Karachi, Pakistan'
          />

          {/* Heatmap Layer */}
          {showHeatmap && heatmapPoints.length > 0 && (
            <HeatmapLayer points={heatmapPoints} disasterMode={disasterMode} radius={25} />
          )}

          {/* Disaster Zone Circles */}
          {zones.filter(z => z.severity === 'CRITICAL' || z.severity === 'HIGH').map((zone, idx) => (
            <Circle
              key={`zone-${idx}`}
              center={[zone.latitude, zone.longitude]}
              radius={(zone.radiusKm || 1.5) * 1000}
              pathOptions={{
                color: disasterMode ? '#ff2a2a' : '#ef4444',
                fillColor: disasterMode ? '#ff2a2a' : '#ef4444',
                fillOpacity: 0.1,
                weight: 1.5,
                className: disasterMode ? 'animate-pulse' : ''
              }}
            />
          ))}

          {/* Markers */}
          {markers.filter(m => m.latitude && m.longitude).map((marker, idx) => {
            const color = getMarkerColor(marker.priority, marker.status, disasterMode);
            const isUrgent = marker.priority === 'HIGH' || marker.priority === 'CRITICAL';
            
            return (
              <Marker
                key={marker.id || idx}
                position={[marker.latitude, marker.longitude]}
                icon={L.divIcon({
                  className: 'custom-marker',
                  html: `<div style="background-color: ${color}; width: ${isUrgent ? '14px' : '10px'}; height: ${isUrgent ? '14px' : '10px'}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 12px ${color}; ${isUrgent ? 'animation: pulse 1s infinite;' : ''}"></div>`,
                  iconSize: [18, 18],
                  popupAnchor: [0, -8],
                })}
                eventHandlers={{ click: () => onMarkerClick?.(marker) }}
              >
                <Popup className="map-popup-glass">
                  <div className="p-3 min-w-[220px]">
                    <p className="font-data text-md text-glow-primary">{marker.title || marker.type || `#${marker.id}`}</p>
                    <p className="font-mono text-xs text-cyan-400/70 mt-1">📍 {marker.locationAddress || marker.area || 'Location not specified'}</p>
                    <div className="flex justify-between mt-2">
                      {marker.priority && (
                        <span className={`font-mono text-xs ${marker.priority === 'HIGH' ? 'text-red-400' : marker.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                          {marker.priority}
                        </span>
                      )}
                      <span className={`font-mono text-xs ${marker.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {marker.status}
                      </span>
                    </div>
                    {marker.description && (
                      <p className="font-mono text-[10px] text-cyan-400/50 mt-2 line-clamp-2">{marker.description}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
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
          border-radius: 10px;
        }
        .map-popup-glass .leaflet-popup-tip {
          background: rgba(5, 9, 22, 0.95);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}