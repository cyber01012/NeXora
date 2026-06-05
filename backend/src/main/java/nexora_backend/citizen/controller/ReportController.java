// ============================================
// FILE: nexora_backend/citizen/controller/ReportController.java
// ============================================
package nexora_backend.citizen.controller;

import jakarta.validation.Valid;
import nexora_backend.citizen.dto.request.ReportRequest;
import nexora_backend.database.entity.CivicReport;
import nexora_backend.citizen.service.ReportService;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/citizen")
public class ReportController {

    private final ReportService reportService;
    private final RequestContext requestContext;

    public ReportController(ReportService reportService,
                            RequestContext requestContext) {
        this.reportService = reportService;
        this.requestContext = requestContext;
    }

    @PostMapping("/reports")
    public ApiResponse<CivicReport> createReport(@Valid @RequestBody ReportRequest request) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        CivicReport report = reportService.createReport(citizenId, request);
        return ApiResponse.ok("Report submitted successfully", report);
    }

    @GetMapping("/my-reports")
    public ApiResponse<List<Map<String, Object>>> myReports(@RequestParam(required = false) String status) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        List<CivicReport> reports = reportService.getMyReports(citizenId, status);

        List<Map<String, Object>> result = reports.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getCivicId());
            map.put("civicId", r.getCivicId());
            map.put("type", r.getComplaintNature() != null ? getTypeName(r.getComplaintNature().getId()) : "UNKNOWN");
            map.put("status", r.getStatus());
            map.put("detail", r.getDetail());
            map.put("description", r.getDetail());
            map.put("city", r.getCity());
            map.put("area", r.getArea());
            map.put("district", r.getDistrict());
            map.put("province", r.getProvince());
            map.put("locationAddress", r.getCity()); // or construct full address
            map.put("evidence", r.getEvidence());
            map.put("createdAt", r.getCreatedAt());
            map.put("trackingCode", "CIV-" + r.getCivicId());
            return map;
        }).collect(Collectors.toList());

        return ApiResponse.ok(result);
    }

    private String getTypeName(Integer natureId) {
        Map<Integer, String> map = new HashMap<>();
        map.put(7, "ELECTRICITY");
        map.put(8, "GAS");
        map.put(9, "ROAD");
        map.put(10, "WATER");
        map.put(1, "MEDICAL");
        return map.getOrDefault(natureId, "OTHER");
    }

    @GetMapping("/stats")
    public ApiResponse<Object> stats() {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        return ApiResponse.ok(reportService.getStats(citizenId));
    }
}