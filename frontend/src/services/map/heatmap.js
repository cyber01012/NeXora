// Heatmap data generator from reports/tasks
export const generateHeatmapData = (items, type = 'reports') => {
  if (!items || items.length === 0) return [];
  
  // Group by location and calculate intensity
  const locationMap = new Map();
  
  items.forEach(item => {
    const lat = item.latitude;
    const lng = item.longitude;
    if (!lat || !lng) return;
    
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    const existing = locationMap.get(key);
    
    if (existing) {
      existing.count++;
      if (item.priority === 'HIGH') existing.priorityScore += 2;
      else if (item.priority === 'MEDIUM') existing.priorityScore += 1;
      else existing.priorityScore += 0.5;
    } else {
      locationMap.set(key, {
        lat,
        lng,
        count: 1,
        priorityScore: item.priority === 'HIGH' ? 2 : item.priority === 'MEDIUM' ? 1 : 0.5
      });
    }
  });
  
  // Convert to heatmap points with intensity (0-1)
  const maxCount = Math.max(...Array.from(locationMap.values()).map(v => v.count), 1);
  
  return Array.from(locationMap.values()).map(point => [
    point.lat,
    point.lng,
    Math.min(0.3 + (point.count / maxCount) * 0.7, 1.0)
  ]);
};

// Heatmap gradient colors
export const getHeatmapGradient = (disasterMode = false) => {
  if (disasterMode) {
    return {
      0.2: '#ff9999',
      0.4: '#ff4444',
      0.6: '#cc0000',
      0.8: '#8b0000',
      1.0: '#4a0000'
    };
  }
  return {
    0.2: '#a5f3fc',
    0.4: '#22d3ee',
    0.6: '#0891b2',
    0.8: '#155e75',
    1.0: '#164e63'
  };
};