package nexora_backend.insight.heatmap;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GoogleMapAPI implements MapAPI {
    @Override
    public List<Map<String, Object>> drawHeat() {
        System.out.println("Drawing heat map using Google Maps API...");
        return List.of(); 
    }
}
