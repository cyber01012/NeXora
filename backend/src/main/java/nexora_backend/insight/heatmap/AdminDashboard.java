package nexora_backend.insight.heatmap;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Qualifier;

@Service("heatmapAdminDashboard") // Name specified to avoid clash if AdminDashboard exists elsewhere
public class AdminDashboard implements DisasterMapService {
    
    private final HeatMapAdapter heatMapAdapter;

    // Injecting the OpenStreetMapAPI specifically to pass to the adapter
    public AdminDashboard(@Qualifier("openStreetMapAPI") MapAPI mapAPI) {
        this.heatMapAdapter = new HeatMapAdapter(mapAPI);
    }

    @Override
    public List<Map<String, Object>> render() {
        System.out.println("AdminDashboard rendering via HeatMapAdapter...");
        return heatMapAdapter.render();
    }
}
