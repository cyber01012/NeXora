package nexora_backend.shared.map;

import java.util.List;
import java.util.Map;

public interface MapService {
    Map<String, Object> showLocation(Double latitude, Double longitude, String label);
    Map<String, Object> showRoute(Double startLat, Double startLng, Double endLat, Double endLng);
    Map<String, Object> showHeatmap(List<double[]> points);
}
