package nexora_backend.insight.heatmap;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class OpenStreetMapAPI implements MapAPI {
    @Override
    public List<Map<String, Object>> drawHeat() {
        System.out.println("Drawing heat map using OpenStreetMap API...");
        return List.of(
            Map.of("id", 1, "name", "Canal Road — Sector 12", "lat", 31.52, "lng", 74.35, "incidents", 28, "severity", "CRITICAL", "type", "Flood Zone"),
            Map.of("id", 2, "name", "Industrial Zone — Block C", "lat", 31.45, "lng", 74.38, "incidents", 22, "severity", "HIGH", "type", "Gas Leak"),
            Map.of("id", 3, "name", "Main Boulevard — Phase I", "lat", 31.51, "lng", 74.34, "incidents", 18, "severity", "MEDIUM", "type", "Road Damage"),
            Map.of("id", 4, "name", "Residential — Phase III", "lat", 31.48, "lng", 74.31, "incidents", 14, "severity", "LOW", "type", "Streetlight"),
            Map.of("id", 5, "name", "Commercial Hub — Downtown", "lat", 31.55, "lng", 74.33, "incidents", 11, "severity", "MEDIUM", "type", "Water Supply"),
            Map.of("id", 6, "name", "Highway M-2 Junction", "lat", 31.58, "lng", 74.40, "incidents", 9, "severity", "HIGH", "type", "Accident Zone")
        );
    }
}
