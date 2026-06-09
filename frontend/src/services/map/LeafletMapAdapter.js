import MapService from './MapService';

/**
 * Adapter wrapping Leaflet map configuration behind MapService.
 */
export default class LeafletMapAdapter extends MapService {
  constructor(config = {}) {
    super();
    this.config = config;
  }

  showLocation(lat, lng, label = 'Location') {
    return {
      provider: 'leaflet',
      center: [lat, lng],
      zoom: 14,
      markers: [{ lat, lng, label }],
      tileUrl: this.config.tileUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };
  }

  showRoute(fromLat, fromLng, toLat, toLng) {
    return {
      provider: 'leaflet',
      center: [(fromLat + toLat) / 2, (fromLng + toLng) / 2],
      zoom: 12,
      route: { from: [fromLat, fromLng], to: [toLat, toLng], color: '#00f0ff' },
      tileUrl: this.config.tileUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };
  }

  showHeatmap(points = []) {
    return {
      provider: 'leaflet',
      center: points[0] || [24.8607, 67.0011],
      zoom: 11,
      heatmap: points,
      tileUrl: this.config.tileUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };
  }

  fromBackendConfig(backendConfig) {
    if (!backendConfig) {
      return this.showLocation(24.8607, 67.0011, 'Karachi');
    }
    return { ...backendConfig, provider: 'leaflet' };
  }
}
