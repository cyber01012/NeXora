package nexora_backend.insight.controller;

import nexora_backend.insight.model.ChatRequest;
import nexora_backend.insight.service.*;
import nexora_backend.insight.store.MockDataStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import nexora_backend.insight.composite.AreaDashboard;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class CivicController {

    @Autowired private DashboardService dashboardService;
    @Autowired private MockDataStore mockDataStore;
    @Autowired private ChatbotService chatbotService;

    // === DASHBOARD ===
@GetMapping("/dashboard")
public ResponseEntity<AreaDashboard> getDashboard(@RequestParam String region) {
    AreaDashboard dashboard = dashboardService.buildDashboard(region);
    return ResponseEntity.ok(dashboard);
}

    @GetMapping("/regions")
    public ResponseEntity<List<String>> getRegions() {
        return ResponseEntity.ok(mockDataStore.getAllRegions());
    }

    // === CHATBOT ===

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequest request) {
        String userMessage = request.getMessages().get(request.getMessages().size() - 1).getContent();
        String aiResponse = chatbotService.chat(request.getMessages(), userMessage);

        Map<String, Object> result = new HashMap<>();
        result.put("response", aiResponse);

        return ResponseEntity.ok(result);
    }
}