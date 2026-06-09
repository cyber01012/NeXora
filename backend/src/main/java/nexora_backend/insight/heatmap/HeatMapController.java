package nexora_backend.insight.heatmap;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

/**
 * Acts as the HeatMapDemo from the UML diagram, exposing the pattern to the frontend.
 */
@RestController
@RequestMapping("/api/admin/heatmap")
public class HeatMapController {
    
    @Autowired
    @Qualifier("heatmapAdminDashboard")
    private DisasterMapService adminDashboard;

    @GetMapping
    public List<Map<String, Object>> getHeatMapData() {
        return adminDashboard.render();
    }
}
