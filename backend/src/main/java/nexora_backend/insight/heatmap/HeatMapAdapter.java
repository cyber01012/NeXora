package nexora_backend.insight.heatmap;

import java.util.List;
import java.util.Map;

public class HeatMapAdapter implements DisasterMapService {
    private final MapAPI mapAPI;

    // The adapter takes a MapAPI instance (e.g. OpenStreetMapAPI) via constructor injection
    public HeatMapAdapter(MapAPI mapAPI) {
        this.mapAPI = mapAPI;
    }

    @Override
    public List<Map<String, Object>> render() {
        return mapAPI.drawHeat();
    }
}
