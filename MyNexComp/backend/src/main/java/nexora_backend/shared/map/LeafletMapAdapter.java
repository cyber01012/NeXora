package nexora_backend.shared.map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LeafletMapAdapter implements MapService {

    private static final Logger log = LoggerFactory.getLogger(LeafletMapAdapter.class);

    @Override
    public Map<String, Object> showLocation(Double latitude, Double longitude, String label) {
        log.info("LeafletMapAdapter: Displaying location at lat: {}, lng: {} with label {}", latitude, longitude, label);
        Map<String, Object> map = new HashMap<>();
        map.put("lat", latitude);
        map.put("lng", longitude);
        map.put("label", label);
        return map;
    }

    @Override
    public Map<String, Object> showRoute(Double startLat, Double startLng, Double endLat, Double endLng) {
        log.info("LeafletMapAdapter: Displaying route from {},{} to {},{}", startLat, startLng, endLat, endLng);
        return new HashMap<>();
    }

    @Override
    public Map<String, Object> showHeatmap(List<double[]> points) {
        log.info("LeafletMapAdapter: Displaying heatmap overlay for {} points", points != null ? points.size() : 0);
        return new HashMap<>();
    }
}