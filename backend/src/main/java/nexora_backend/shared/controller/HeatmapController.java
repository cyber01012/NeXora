package nexora_backend.shared.controller;

import nexora_backend.shared.dto.HeatmapZone;
import nexora_backend.shared.service.HeatmapService;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/map")
public class HeatmapController {
    
    private final HeatmapService heatmapService;
    
    public HeatmapController(HeatmapService heatmapService) {
        this.heatmapService = heatmapService;
    }
    
    @GetMapping("/heatmap/disaster")
    public ResponseEntity<List<HeatmapZone>> getDisasterHeatmap() {
        return ResponseEntity.ok(heatmapService.getDisasterHeatmap());
    }
    
    @GetMapping("/heatmap/tasks")
    public ResponseEntity<List<HeatmapZone>> getTaskHeatmap(
            /* @AuthenticationPrincipal String username */ @RequestParam String username) {
        // Simplified auth context for this example
        return ResponseEntity.ok(heatmapService.getTaskHeatmap(username));
    }
    
    @GetMapping("/disaster-mode/status")
    public ResponseEntity<DisasterModeResponse> getDisasterModeStatus() {
        List<HeatmapZone> criticalZones = heatmapService.getDisasterHeatmap().stream()
            .filter(z -> "CRITICAL".equals(z.getIntensity()))
            .toList();
        
        return ResponseEntity.ok(new DisasterModeResponse(
            criticalZones.size() >= 2,
            criticalZones.size(),
            "DISASTER_MODE_" + (criticalZones.size() >= 2 ? "ACTIVE" : "INACTIVE")
        ));
    }
    
    public record DisasterModeResponse(boolean active, int criticalZones, String code) {}
}
